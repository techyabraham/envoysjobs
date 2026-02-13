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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../common/zod-validation.pipe");
const jwt_auth_guard_1 = require("../../common/jwt-auth.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
const roles_guard_1 = require("../../common/roles.guard");
const jobs_service_1 = require("./jobs.service");
const jobs_import_service_1 = require("./jobs.import.service");
const contactMethodEnum = zod_1.z.enum(["PLATFORM", "EMAIL", "WEBSITE", "WHATSAPP"]);
const contactInfoSchema = zod_1.z.object({
    contactMethods: zod_1.z.array(contactMethodEnum).optional(),
    contactEmail: zod_1.z.string().email().optional(),
    contactWebsite: zod_1.z.string().url().optional(),
    contactWhatsapp: zod_1.z.string().min(8).optional()
});
function validateContact(data, ctx) {
    const methods = data.contactMethods ?? [];
    if (methods.includes("EMAIL") && !data.contactEmail) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["contactEmail"], message: "Email is required." });
    }
    if (methods.includes("WEBSITE") && !data.contactWebsite) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["contactWebsite"], message: "Website is required." });
    }
    if (methods.includes("WHATSAPP") && !data.contactWhatsapp) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, path: ["contactWhatsapp"], message: "WhatsApp number is required." });
    }
}
const jobBaseSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().min(2),
    locationType: zod_1.z.enum(["ONSITE", "REMOTE", "HYBRID"]),
    location: zod_1.z.string().optional(),
    salaryMin: zod_1.z.number().optional(),
    salaryMax: zod_1.z.number().optional(),
    urgency: zod_1.z.string().optional(),
    status: zod_1.z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional()
});
const jobCreateSchema = jobBaseSchema.merge(contactInfoSchema).superRefine(validateContact);
const jobUpdateSchema = jobBaseSchema.partial().merge(contactInfoSchema).superRefine(validateContact);
let JobsController = class JobsController {
    constructor(jobsService, jobsImport) {
        this.jobsService = jobsService;
        this.jobsImport = jobsImport;
    }
    create(req, body) {
        return this.jobsService.create({ ...body, hirerId: req.user?.id || "" });
    }
    list(query) {
        return this.jobsService.list(query);
    }
    get(id) {
        return this.jobsService.get(id);
    }
    update(id, body) {
        return this.jobsService.update(id, body);
    }
    publish(id) {
        return this.jobsService.publish(id);
    }
    close(id) {
        return this.jobsService.close(id);
    }
    saved(req) {
        return this.jobsService.listSavedJobs(req.user?.id || "");
    }
    save(req, id) {
        return this.jobsService.saveJob(req.user?.id || "", id);
    }
    unsave(req, id) {
        return this.jobsService.unsaveJob(req.user?.id || "", id);
    }
    importExternal() {
        return this.jobsImport.importExternalJobs();
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(jobCreateSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, void 0]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(jobUpdateSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, void 0]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/publish"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(":id/close"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "close", null);
__decorate([
    (0, common_1.Get)("saved"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "saved", null);
__decorate([
    (0, common_1.Post)(":id/save"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)(":id/save"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "unsave", null);
__decorate([
    (0, common_1.Post)("import/external"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "importExternal", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.Controller)("jobs"),
    __metadata("design:paramtypes", [jobs_service_1.JobsService, jobs_import_service_1.JobsImportService])
], JobsController);
