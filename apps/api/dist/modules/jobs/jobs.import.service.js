"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var JobsImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsImportService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let JobsImportService = JobsImportService_1 = class JobsImportService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(JobsImportService_1.name);
    }
    async onModuleInit() {
        const runOnStart = this.config.get("JOBS_IMPORT_ON_START");
        if (runOnStart === "true") {
            await this.importExternalJobs();
        }
    }
    async scheduledImport() {
        const enabled = this.config.get("JOBS_IMPORT_ENABLED");
        if (enabled !== "true")
            return;
        await this.importExternalJobs();
    }
    async importExternalJobs() {
        const results = [];
        results.push(await this.importAdzunaJobs());
        results.push(await this.importRemotiveJobs());
        return results;
    }
    async getSystemHirerId() {
        const email = "external-jobs@envoysjobs.com";
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            return existing.id;
        const passwordHash = await bcryptjs_1.default.hash("external-jobs", 10);
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
    normalizeText(text) {
        if (!text)
            return "";
        const cleaned = (0, sanitize_html_1.default)(text, { allowedTags: [], allowedAttributes: {} });
        return cleaned.replace(/\s+/g, " ").trim();
    }
    async importAdzunaJobs() {
        const appId = this.config.get("ADZUNA_APP_ID") || "";
        const appKey = this.config.get("ADZUNA_APP_KEY") || "";
        if (!appId || !appKey) {
            return { source: "ADZUNA", fetched: 0, upserted: 0, skipped: 0 };
        }
        const country = this.config.get("ADZUNA_COUNTRY") || "ng";
        const pageSize = Number(this.config.get("ADZUNA_PAGE_SIZE") || "20");
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
        const data = (await response.json());
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
            const locationName = job?.location?.display_name ??
                (Array.isArray(job?.location?.area) ? job.location.area.join(", ") : null);
            const title = this.normalizeText(job?.title);
            if (!title) {
                skipped += 1;
                continue;
            }
            const description = this.normalizeText(job?.description);
            const company = this.normalizeText(job?.company?.display_name);
            const locationType = typeof locationName === "string" && locationName.toLowerCase().includes("remote")
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
    async importRemotiveJobs() {
        const enabled = this.config.get("REMOTIVE_ENABLED");
        if (enabled === "false") {
            return { source: "REMOTIVE", fetched: 0, upserted: 0, skipped: 0 };
        }
        const url = this.config.get("REMOTIVE_API_URL") || "https://remotive.com/api/remote-jobs";
        const minAgeHours = Number(this.config.get("REMOTIVE_MIN_AGE_HOURS") || "24");
        const response = await fetch(url);
        if (!response.ok) {
            this.logger.warn(`Remotive fetch failed: ${response.status}`);
            return { source: "REMOTIVE", fetched: 0, upserted: 0, skipped: 0 };
        }
        const data = (await response.json());
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
};
exports.JobsImportService = JobsImportService;
__decorate([
    (0, schedule_1.Cron)("0 */12 * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsImportService.prototype, "scheduledImport", null);
exports.JobsImportService = JobsImportService = JobsImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, config_1.ConfigService])
], JobsImportService);
