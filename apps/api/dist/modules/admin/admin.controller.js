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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../common/zod-validation.pipe");
const jwt_auth_guard_1 = require("../../common/jwt-auth.guard");
const roles_guard_1 = require("../../common/roles.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
const admin_service_1 = require("./admin.service");
const verificationSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.VerificationStatus)
});
const stewardSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.StewardStatus)
});
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    users() {
        return this.adminService.users();
    }
    jobs() {
        return this.adminService.jobs();
    }
    reports() {
        return this.adminService.reports();
    }
    verifications() {
        return this.adminService.verifications();
    }
    updateVerification(id, body) {
        return this.adminService.updateVerification(id, body.status);
    }
    updateSteward(userId, body) {
        return this.adminService.updateSteward(userId, body.status);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Get)("jobs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "jobs", null);
__decorate([
    (0, common_1.Get)("reports"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "reports", null);
__decorate([
    (0, common_1.Get)("verifications"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifications", null);
__decorate([
    (0, common_1.Patch)("verifications/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(verificationSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, void 0]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateVerification", null);
__decorate([
    (0, common_1.Patch)("stewards/:userId"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(stewardSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, void 0]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateSteward", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
