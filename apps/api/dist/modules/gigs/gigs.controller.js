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
exports.GigsController = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../common/zod-validation.pipe");
const jwt_auth_guard_1 = require("../../common/jwt-auth.guard");
const gigs_service_1 = require("./gigs.service");
const gigSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    amount: zod_1.z.string().min(2),
    location: zod_1.z.string().min(2),
    duration: zod_1.z.string().min(1),
    urgent: zod_1.z.boolean().optional()
});
const gigUpdateSchema = gigSchema.partial();
let GigsController = class GigsController {
    constructor(gigsService) {
        this.gigsService = gigsService;
    }
    create(req, body) {
        return this.gigsService.create({ ...body, postedById: req.user?.id || "" });
    }
    list(excludeMine, req) {
        const exclude = excludeMine === "true";
        return this.gigsService.list({
            excludeMine: exclude,
            userId: req?.user?.id
        });
    }
    listMine(req) {
        return this.gigsService.listByUser(req.user?.id || "");
    }
    listApplied(req) {
        return this.gigsService.listApplied(req.user?.id || "");
    }
    get(id) {
        return this.gigsService.get(id);
    }
    update(req, id, body) {
        return this.gigsService.update(id, req.user?.id || "", body);
    }
    apply(req, id) {
        return this.gigsService.apply(id, req.user?.id || "");
    }
};
exports.GigsController = GigsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(gigSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, void 0]),
    __metadata("design:returntype", void 0)
], GigsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("excludeMine")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GigsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("mine"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GigsController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)("applied"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GigsController.prototype, "listApplied", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GigsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(gigUpdateSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, void 0]),
    __metadata("design:returntype", void 0)
], GigsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/apply"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GigsController.prototype, "apply", null);
exports.GigsController = GigsController = __decorate([
    (0, common_1.Controller)("gigs"),
    __metadata("design:paramtypes", [gigs_service_1.GigsService])
], GigsController);
