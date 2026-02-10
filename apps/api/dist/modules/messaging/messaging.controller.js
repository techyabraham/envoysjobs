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
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const throttler_1 = require("@nestjs/throttler");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../common/zod-validation.pipe");
const jwt_auth_guard_1 = require("../../common/jwt-auth.guard");
const messaging_service_1 = require("./messaging.service");
const conversationSchema = zod_1.z.object({
    jobId: zod_1.z.string(),
    envoyId: zod_1.z.string(),
    hirerId: zod_1.z.string()
});
const messageSchema = zod_1.z.object({
    text: zod_1.z.string().min(1)
});
const attachmentSchema = zod_1.z.object({
    text: zod_1.z.string().optional()
});
let MessagingController = class MessagingController {
    constructor(messagingService) {
        this.messagingService = messagingService;
    }
    listConversations(req, userId) {
        return this.messagingService.listConversations(userId || req.user?.id || "");
    }
    getOrCreate(body) {
        return this.messagingService.getOrCreateConversation(body);
    }
    listMessages(id) {
        return this.messagingService.listMessages(id);
    }
    sendMessage(id, req, body) {
        return this.messagingService.sendMessage(id, req.user?.id || "", body.text);
    }
    sendAttachment(id, req, file, body) {
        return this.messagingService.sendAttachment(id, req.user?.id || "", file, body.text);
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Get)("conversations"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagingController.prototype, "listConversations", null);
__decorate([
    (0, common_1.Post)("conversations"),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(conversationSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", void 0)
], MessagingController.prototype, "getOrCreate", null);
__decorate([
    (0, common_1.Get)("conversations/:id/messages"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessagingController.prototype, "listMessages", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, common_1.Post)("conversations/:id/messages"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(messageSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, void 0]),
    __metadata("design:returntype", void 0)
], MessagingController.prototype, "sendMessage", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)("conversations/:id/attachments"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowed = ["image/jpeg", "image/png", "application/pdf"];
            if (!allowed.includes(file.mimetype)) {
                return cb(new Error("Invalid file type"), false);
            }
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(attachmentSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, void 0]),
    __metadata("design:returntype", void 0)
], MessagingController.prototype, "sendAttachment", null);
exports.MessagingController = MessagingController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService])
], MessagingController);
