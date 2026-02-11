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
        const skillKeywords = await this.getSkillKeywords();
        results.push(await this.importJSearchJobs(skillKeywords));
        results.push(await this.importRemotiveJobs(skillKeywords));
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
    matchesSkills(text, skills) {
        const normalized = text.toLowerCase();
        return skills.some((skill) => normalized.includes(skill.toLowerCase()));
    }
    async getSkillKeywords() {
        const enabled = this.config.get("JOBS_IMPORT_USE_SKILLS");
        if (enabled === "false")
            return [];
        const limit = Number(this.config.get("JOBS_IMPORT_SKILL_LIMIT") || "6");
        const skillsFromJoin = await this.prisma.userSkill.findMany({
            select: { skill: { select: { name: true } } }
        });
        const joined = skillsFromJoin.map((item) => item.skill.name).filter(Boolean);
        const profileSkills = await this.prisma.envoyProfile.findMany({
            select: { skills: true }
        });
        for (const profile of profileSkills) {
            if (!profile.skills)
                continue;
            const parts = profile.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);
            joined.push(...parts);
        }
        const counts = new Map();
        for (const skill of joined) {
            const key = skill.toLowerCase();
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        const ranked = [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([skill]) => skill);
        return ranked.slice(0, limit);
    }
    async importJSearchJobs(skillKeywords) {
        const apiKey = this.config.get("JSEARCH_API_KEY") || "";
        if (!apiKey) {
            return { source: "JSEARCH", fetched: 0, upserted: 0, skipped: 0 };
        }
        const rapidApiHost = this.config.get("JSEARCH_RAPIDAPI_HOST") || "jsearch.p.rapidapi.com";
        const useRapidApi = this.config.get("JSEARCH_RAPIDAPI") === "true" || apiKey.includes("amsh");
        const baseUrl = useRapidApi
            ? this.config.get("JSEARCH_API_URL") || "https://jsearch.p.rapidapi.com/search"
            : this.config.get("JSEARCH_API_URL") || "https://api.openwebninja.com/v1/job-search";
        const baseQuery = this.config.get("JSEARCH_QUERY") || "jobs";
        const location = this.config.get("JSEARCH_LOCATION") || "Nigeria";
        const country = this.config.get("JSEARCH_COUNTRY") || "ng";
        const datePosted = this.config.get("JSEARCH_DATE_POSTED") || "all";
        const maxPerRun = Number(this.config.get("JOBS_IMPORT_MAX_PER_RUN") || "20");
        const query = skillKeywords.length > 0 ? skillKeywords.join(" OR ") : baseQuery;
        const url = new URL(baseUrl);
        if (useRapidApi) {
            url.searchParams.set("query", `${query} in ${location}`.trim());
            url.searchParams.set("page", "1");
            url.searchParams.set("num_pages", "1");
            if (country) {
                url.searchParams.set("country", country.toLowerCase());
            }
        }
        else {
            url.searchParams.set("query", query);
            url.searchParams.set("location", location);
            url.searchParams.set("country", country);
            url.searchParams.set("date_posted", datePosted);
            url.searchParams.set("page", "1");
            url.searchParams.set("num_pages", "1");
        }
        const headers = useRapidApi
            ? { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": rapidApiHost }
            : { Authorization: `Bearer ${apiKey}` };
        const response = await fetch(url.toString(), { headers });
        if (!response.ok) {
            this.logger.warn(`JSearch fetch failed: ${response.status}`);
            return { source: "JSEARCH", fetched: 0, upserted: 0, skipped: 0 };
        }
        const data = (await response.json());
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
            const locationName = locationParts.length > 0 ? locationParts.join(", ") : this.normalizeText(job?.job_location ?? location);
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
    async importRemotiveJobs(skillKeywords) {
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
        const maxPerRun = Number(this.config.get("JOBS_IMPORT_MAX_PER_RUN") || "20");
        const data = (await response.json());
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
