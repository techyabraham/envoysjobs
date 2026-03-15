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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoMessagesController = void 0;
const common_1 = require("@nestjs/common");
const auto_messages_service_1 = require("./auto-messages.service");
const jwt_auth_guard_1 = require("../../common/jwt-auth.guard");
const roles_guard_1 = require("../../common/roles.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
let AutoMessagesController = class AutoMessagesController {
    constructor(autoMessagesService) {
        this.autoMessagesService = autoMessagesService;
    }
    list() {
        return this.autoMessagesService.list();
    }
    seed() {
        return this.autoMessagesService.seed();
    }
};
exports.AutoMessagesController = AutoMessagesController;
__decorate([
    (0, common_1.Get)("templates"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutoMessagesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("seed"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutoMessagesController.prototype, "seed", null);
exports.AutoMessagesController = AutoMessagesController = __decorate([
    (0, common_1.Controller)("auto-messages"),
    __metadata("design:paramtypes", [auto_messages_service_1.AutoMessagesService])
], AutoMessagesController);
