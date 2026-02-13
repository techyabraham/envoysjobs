import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import sanitizeHtml from "sanitize-html";
import bcrypt from "bcryptjs";

type ImportSummary = {
  source: "JSEARCH" | "REMOTIVE";
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
    const skillKeywords = await this.getSkillKeywords();
    results.push(await this.importJSearchJobs(skillKeywords));
    results.push(await this.importRemotiveJobs(skillKeywords));
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

  private matchesSkills(text: string, skills: string[]) {
    const normalized = text.toLowerCase();
    return skills.some((skill) => {
      const raw = skill.toLowerCase().trim();
      if (!raw) return false;
      const tokens = raw.split(/[\s/,&-]+/).filter(Boolean);
      return tokens.some((token) => token.length >= 3 && normalized.includes(token));
    });
  }

  private async getSkillKeywords() {
    const enabled = this.config.get<string>("JOBS_IMPORT_USE_SKILLS");
    if (enabled === "false") return [];

    const limit = Number(this.config.get<string>("JOBS_IMPORT_SKILL_LIMIT") || "6");
    const seed = this.config.get<string>("JOBS_IMPORT_SKILL_SEED") || "";
    const seeded = seed
      .split("|")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const skillsFromJoin = await this.prisma.userSkill.findMany({
      select: { skill: { select: { name: true } } }
    });

    const joined = skillsFromJoin.map((item) => item.skill.name).filter(Boolean);
    const profileSkills = await this.prisma.envoyProfile.findMany({
      select: { skills: true }
    });

    for (const profile of profileSkills) {
      if (!profile.skills) continue;
      const parts = profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
      joined.push(...parts);
    }

    joined.push(...seeded);

    const counts = new Map<string, number>();
    for (const skill of joined) {
      const key = skill.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const ranked = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => skill);

    return ranked.slice(0, limit);
  }

  private async importJSearchJobs(skillKeywords: string[]): Promise<ImportSummary> {
    const apiKey = this.config.get<string>("JSEARCH_API_KEY") || "";
    if (!apiKey) {
      return { source: "JSEARCH", fetched: 0, upserted: 0, skipped: 0 };
    }

    const rapidApiHost = this.config.get<string>("JSEARCH_RAPIDAPI_HOST") || "jsearch.p.rapidapi.com";
    const useRapidApi =
      this.config.get<string>("JSEARCH_RAPIDAPI") === "true" || apiKey.includes("amsh");
    const baseUrl = useRapidApi
      ? this.config.get<string>("JSEARCH_API_URL") || "https://jsearch.p.rapidapi.com/search"
      : this.config.get<string>("JSEARCH_API_URL") || "https://api.openwebninja.com/v1/job-search";
    const baseQuery = this.config.get<string>("JSEARCH_QUERY") || "jobs in Nigeria";
    const location = this.config.get<string>("JSEARCH_LOCATION") || "Nigeria";
    const country = this.config.get<string>("JSEARCH_COUNTRY") || "ng";
    const datePosted = this.config.get<string>("JSEARCH_DATE_POSTED") || "all";
    const maxPerRun = Number(this.config.get<string>("JOBS_IMPORT_MAX_PER_RUN") || "20");

    const query = baseQuery;
    const url = new URL(baseUrl);
    if (useRapidApi) {
      url.searchParams.set("query", `${query} in ${location}`.trim());
      url.searchParams.set("page", "1");
      url.searchParams.set("num_pages", "1");
      if (country) {
        url.searchParams.set("country", country.toLowerCase());
      }
    } else {
      url.searchParams.set("query", query);
      url.searchParams.set("location", location);
      url.searchParams.set("country", country);
      url.searchParams.set("date_posted", datePosted);
      url.searchParams.set("page", "1");
      url.searchParams.set("num_pages", "1");
    }

    const headers: Record<string, string> = useRapidApi
      ? { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": rapidApiHost }
      : { Authorization: `Bearer ${apiKey}` };

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      this.logger.warn(`JSearch fetch failed: ${response.status}`);
      return { source: "JSEARCH", fetched: 0, upserted: 0, skipped: 0 };
    }

    const data = (await response.json()) as { jobs?: any[]; data?: any[]; results?: any[] };
    const jobs = (data.jobs ?? data.data ?? data.results ?? []).slice(0, maxPerRun);
    const hirerId = await this.getSystemHirerId();
    let upserted = 0;
    let skipped = 0;

    for (const job of jobs) {
      const sourceId = String(job?.job_id ?? job?.id ?? "");
      if (!sourceId) {
        skipped += 1;
        continue;
      }

      const title = this.normalizeText(job?.job_title ?? job?.title);
      if (!title) {
        skipped += 1;
        continue;
      }

      const description = this.normalizeText(job?.job_description ?? job?.description);
      if (skillKeywords.length > 0 && !this.matchesSkills(`${title} ${description}`, skillKeywords)) {
        skipped += 1;
        continue;
      }
      const company = this.normalizeText(job?.employer_name ?? job?.company_name ?? job?.company);
      const locationParts = [
        job?.job_city,
        job?.job_state,
        job?.job_country
      ].filter(Boolean);
      const locationName =
        locationParts.length > 0 ? locationParts.join(", ") : this.normalizeText(job?.job_location ?? location);

      const isRemote = Boolean(job?.job_is_remote);
      const locationType = isRemote ? "REMOTE" : "ONSITE";

      const minSalaryRaw = job?.job_min_salary ?? job?.min_salary;
      const maxSalaryRaw = job?.job_max_salary ?? job?.max_salary;
      const salaryMin = Number.isFinite(Number(minSalaryRaw)) ? Math.round(Number(minSalaryRaw)) : undefined;
      const salaryMax = Number.isFinite(Number(maxSalaryRaw)) ? Math.round(Number(maxSalaryRaw)) : undefined;

      const applyUrl = job?.job_apply_link ?? job?.apply_url ?? job?.job_url ?? job?.url;
      const sourceUrl = job?.job_google_link ?? applyUrl;

      await this.prisma.job.upsert({
        where: { source_sourceId: { source: "JSEARCH", sourceId } },
        update: {
          title,
          description,
          locationType,
          location: locationName ?? undefined,
          salaryMin,
          salaryMax,
          company: company || undefined,
          sourceUrl: sourceUrl ?? undefined,
          applyUrl: applyUrl ?? undefined,
          status: "PUBLISHED"
        },
        create: {
          title,
          description,
          locationType,
          location: locationName ?? undefined,
          salaryMin,
          salaryMax,
          company: company || undefined,
          source: "JSEARCH",
          sourceId,
          sourceUrl: sourceUrl ?? undefined,
          applyUrl: applyUrl ?? undefined,
          status: "PUBLISHED",
          hirerId
        }
      });
      upserted += 1;
    }

    return { source: "JSEARCH", fetched: jobs.length, upserted, skipped };
  }

  private async importRemotiveJobs(skillKeywords: string[]): Promise<ImportSummary> {
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

    const maxPerRun = Number(this.config.get<string>("JOBS_IMPORT_MAX_PER_RUN") || "20");
    const data = (await response.json()) as { jobs?: any[] };
    const results = (data.jobs ?? []).slice(0, maxPerRun);
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
      if (skillKeywords.length > 0 && !this.matchesSkills(`${title} ${description}`, skillKeywords)) {
        skipped += 1;
        continue;
      }
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
