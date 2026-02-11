import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import sanitizeHtml from "sanitize-html";
import bcrypt from "bcryptjs";

type ImportSummary = {
  source: "ADZUNA" | "REMOTIVE";
  fetched: number;
  upserted: number;
  skipped: number;
};

@Injectable()
export class JobsImportService implements OnModuleInit {
  private readonly logger = new Logger(JobsImportService.name);

  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async onModuleInit() {
    const runOnStart = this.config.get<string>("JOBS_IMPORT_ON_START");
    if (runOnStart === "true") {
      await this.importExternalJobs();
    }
  }

  @Cron("0 */12 * * *")
  async scheduledImport() {
    const enabled = this.config.get<string>("JOBS_IMPORT_ENABLED");
    if (enabled !== "true") return;
    await this.importExternalJobs();
  }

  async importExternalJobs() {
    const results: ImportSummary[] = [];
    results.push(await this.importAdzunaJobs());
    results.push(await this.importRemotiveJobs());
    return results;
  }

  private async getSystemHirerId() {
    const email = "external-jobs@envoysjobs.com";
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) return existing.id;

    const passwordHash = await bcrypt.hash("external-jobs", 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: "External",
        lastName: "Jobs",
        role: "HIRER"
      }
    });

    await this.prisma.hirerProfile.create({
      data: {
        userId: user.id,
        type: "BUSINESS",
        businessName: "External Job Sources"
      }
    });

    return user.id;
  }

  private normalizeText(text?: string | null) {
    if (!text) return "";
    const cleaned = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
    return cleaned.replace(/\s+/g, " ").trim();
  }

  private async importAdzunaJobs(): Promise<ImportSummary> {
    const appId = this.config.get<string>("ADZUNA_APP_ID") || "";
    const appKey = this.config.get<string>("ADZUNA_APP_KEY") || "";
    if (!appId || !appKey) {
      return { source: "ADZUNA", fetched: 0, upserted: 0, skipped: 0 };
    }

    const country = this.config.get<string>("ADZUNA_COUNTRY") || "ng";
    const pageSize = Number(this.config.get<string>("ADZUNA_PAGE_SIZE") || "20");
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", appKey);
    url.searchParams.set("results_per_page", String(pageSize));
    url.searchParams.set("content-type", "application/json");
    url.searchParams.set("sort_by", "date");

    const response = await fetch(url.toString());
    if (!response.ok) {
      this.logger.warn(`Adzuna fetch failed: ${response.status}`);
      return { source: "ADZUNA", fetched: 0, upserted: 0, skipped: 0 };
    }

    const data = (await response.json()) as { results?: any[] };
    const results = data.results ?? [];
    const hirerId = await this.getSystemHirerId();
    let upserted = 0;
    let skipped = 0;

    for (const job of results) {
      const sourceId = String(job?.id ?? "");
      if (!sourceId) {
        skipped += 1;
        continue;
      }

      const locationName =
        job?.location?.display_name ??
        (Array.isArray(job?.location?.area) ? job.location.area.join(", ") : null);
      const title = this.normalizeText(job?.title);
      if (!title) {
        skipped += 1;
        continue;
      }

      const description = this.normalizeText(job?.description);
      const company = this.normalizeText(job?.company?.display_name);
      const locationType =
        typeof locationName === "string" && locationName.toLowerCase().includes("remote")
          ? "REMOTE"
          : "ONSITE";

      await this.prisma.job.upsert({
        where: { source_sourceId: { source: "ADZUNA", sourceId } },
        update: {
          title,
          description,
          locationType,
          location: locationName ?? undefined,
          salaryMin: job?.salary_min ? Math.round(job.salary_min) : undefined,
          salaryMax: job?.salary_max ? Math.round(job.salary_max) : undefined,
          company: company || undefined,
          sourceUrl: job?.redirect_url ?? undefined,
          applyUrl: job?.redirect_url ?? undefined,
          status: "PUBLISHED"
        },
        create: {
          title,
          description,
          locationType,
          location: locationName ?? undefined,
          salaryMin: job?.salary_min ? Math.round(job.salary_min) : undefined,
          salaryMax: job?.salary_max ? Math.round(job.salary_max) : undefined,
          company: company || undefined,
          source: "ADZUNA",
          sourceId,
          sourceUrl: job?.redirect_url ?? undefined,
          applyUrl: job?.redirect_url ?? undefined,
          status: "PUBLISHED",
          hirerId
        }
      });
      upserted += 1;
    }

    return { source: "ADZUNA", fetched: results.length, upserted, skipped };
  }

  private async importRemotiveJobs(): Promise<ImportSummary> {
    const enabled = this.config.get<string>("REMOTIVE_ENABLED");
    if (enabled === "false") {
      return { source: "REMOTIVE", fetched: 0, upserted: 0, skipped: 0 };
    }

    const url = this.config.get<string>("REMOTIVE_API_URL") || "https://remotive.com/api/remote-jobs";
    const minAgeHours = Number(this.config.get<string>("REMOTIVE_MIN_AGE_HOURS") || "24");

    const response = await fetch(url);
    if (!response.ok) {
      this.logger.warn(`Remotive fetch failed: ${response.status}`);
      return { source: "REMOTIVE", fetched: 0, upserted: 0, skipped: 0 };
    }

    const data = (await response.json()) as { jobs?: any[] };
    const results = data.jobs ?? [];
    const hirerId = await this.getSystemHirerId();
    let upserted = 0;
    let skipped = 0;

    const cutoff = Date.now() - minAgeHours * 60 * 60 * 1000;

    for (const job of results) {
      const sourceId = String(job?.id ?? "");
      if (!sourceId) {
        skipped += 1;
        continue;
      }

      const publishedAt = job?.publication_date ?? job?.published_at ?? null;
      if (publishedAt && new Date(publishedAt).getTime() > cutoff) {
        skipped += 1;
        continue;
      }

      const title = this.normalizeText(job?.title);
      if (!title) {
        skipped += 1;
        continue;
      }

      const description = this.normalizeText(job?.description);
      const company = this.normalizeText(job?.company_name);
      const location = this.normalizeText(job?.candidate_required_location) || "Remote";

      await this.prisma.job.upsert({
        where: { source_sourceId: { source: "REMOTIVE", sourceId } },
        update: {
          title,
          description,
          locationType: "REMOTE",
          location,
          company: company || undefined,
          sourceUrl: job?.url ?? undefined,
          applyUrl: job?.url ?? undefined,
          status: "PUBLISHED"
        },
        create: {
          title,
          description,
          locationType: "REMOTE",
          location,
          company: company || undefined,
          source: "REMOTIVE",
          sourceId,
          sourceUrl: job?.url ?? undefined,
          applyUrl: job?.url ?? undefined,
          status: "PUBLISHED",
          hirerId
        }
      });
      upserted += 1;
    }

    return { source: "REMOTIVE", fetched: results.length, upserted, skipped };
  }
}
