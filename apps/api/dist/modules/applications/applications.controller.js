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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../common/zod-validation.pipe");
const jwt_auth_guard_1 = require("../../common/jwt-auth.guard");
const applications_service_1 = require("./applications.service");
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPLIED", "IN_REVIEW", "INTERVIEW", "OFFER", "HIRED", "REJECTED"])
});
let ApplicationsController = class ApplicationsController {
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    apply(jobId, req) {
        return this.applicationsService.apply(jobId, req.user?.id || "");
    }
    list(req) {
        return this.applicationsService.list(req.user?.id || "");
    }
    updateStatus(id, body) {
        return this.applicationsService.updateStatus(id, body.status);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Post)("jobs/:id/apply"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)("applications"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)("applications/:id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(statusSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, void 0]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "updateStatus", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
