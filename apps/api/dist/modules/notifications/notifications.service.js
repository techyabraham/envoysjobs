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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, title, body) {
        if (!userId)
            return null;
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.notification.create({
                data: { userId, title, body }
            });
        }
        (0, memory_store_1.seedMemory)();
        const notification = {
            id: `${Date.now()}-${Math.random()}`,
            userId,
            title,
            body,
            read: false,
            createdAt: new Date()
        };
        memory_store_1.memoryStore.notifications.push(notification);
        return notification;
    }
    list(userId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" }
            });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }).catch(() => {
            return memory_store_1.memoryStore.notifications
                .filter((n) => n.userId === userId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        });
    }
    async read(userId, id) {
        if (!(0, memory_store_1.useMemory)()) {
            const existing = await this.prisma.notification.findFirst({
                where: { id, userId }
            });
            if (!existing)
                return null;
            return this.prisma.notification.update({
                where: { id: existing.id },
                data: { read: true }
            });
        }
        (0, memory_store_1.seedMemory)();
        const notification = memory_store_1.memoryStore.notifications.find((n) => n.id === id && n.userId === userId);
        if (!notification)
            return null;
        notification.read = true;
        return notification;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
