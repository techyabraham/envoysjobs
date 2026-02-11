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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getUser(userId) {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.user.findUnique({ where: { id: userId } });
        (0, memory_store_1.seedMemory)();
        return this.prisma.user.findUnique({ where: { id: userId } }).catch(() => {
            return memory_store_1.memoryStore.users.find((u) => u.id === userId) ?? null;
        });
    }
    updateUser(userId, data) {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.user.update({ where: { id: userId }, data });
        (0, memory_store_1.seedMemory)();
        return this.prisma.user.update({ where: { id: userId }, data }).catch(() => {
            const index = memory_store_1.memoryStore.users.findIndex((u) => u.id === userId);
            if (index === -1)
                return null;
            memory_store_1.memoryStore.users[index] = { ...memory_store_1.memoryStore.users[index], ...data };
            return memory_store_1.memoryStore.users[index];
        });
    }
    async uploadAvatar(userId, file) {
        if (!file)
            return { error: "No file uploaded" };
        const uploadsDir = path_1.default.join(process.cwd(), "apps/api/uploads");
        await promises_1.default.mkdir(uploadsDir, { recursive: true });
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filename = `avatar-${userId}-${Date.now()}-${safeName}`;
        const filePath = path_1.default.join(uploadsDir, filename);
        await promises_1.default.writeFile(filePath, file.buffer);
        const imageUrl = `/uploads/${filename}`;
        await this.updateUser(userId, { imageUrl });
        return { imageUrl };
    }
    getEnvoyProfile(userId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.envoyProfile.findUnique({
                where: { userId },
                include: { user: true }
            });
        }
        return this.prisma.envoyProfile.findUnique({ where: { userId } }).catch(() => {
            return {
                userId,
                bio: "Envoy profile",
                location: "Lagos",
                availability: "Full-time",
                portfolioLinks: "",
                rating: 4.8,
                verified: false,
                user: memory_store_1.memoryStore.users.find((u) => u.id === userId)
            };
        });
    }
    updateEnvoyProfile(userId, data) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.envoyProfile.upsert({
                where: { userId },
                update: data,
                create: { userId, ...data }
            });
        }
        return this.prisma.envoyProfile
            .upsert({
            where: { userId },
            update: data,
            create: { userId, ...data }
        })
            .catch(() => ({ userId, ...data }));
    }
    getHirerProfile(userId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.hirerProfile.findUnique({
                where: { userId },
                include: { user: true }
            });
        }
        return this.prisma.hirerProfile.findUnique({ where: { userId } }).catch(() => {
            return {
                userId,
                type: "INDIVIDUAL",
                businessName: null,
                rating: 4.5,
                user: memory_store_1.memoryStore.users.find((u) => u.id === userId)
            };
        });
    }
    updateHirerProfile(userId, data) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.hirerProfile.upsert({
                where: { userId },
                update: data,
                create: { userId, ...data }
            });
        }
        return this.prisma.hirerProfile
            .upsert({
            where: { userId },
            update: data,
            create: { userId, ...data }
        })
            .catch(() => ({ userId, ...data }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
