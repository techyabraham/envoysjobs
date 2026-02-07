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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
let VerificationService = class VerificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upload(userId, file) {
        if (!userId)
            return { status: "missing-user" };
        if (!(0, memory_store_1.useMemory)()) {
            const uploadsDir = path_1.default.join(process.cwd(), "apps/api/uploads");
            await fs_1.promises.mkdir(uploadsDir, { recursive: true });
            const filename = `${userId}-${Date.now()}-${file.originalname}`.replace(/\\s+/g, "_");
            const filePath = path_1.default.join(uploadsDir, filename);
            await fs_1.promises.writeFile(filePath, file.buffer);
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const phone = user?.phone || userId;
            return this.prisma.verification.upsert({
                where: { phone },
                update: {
                    status: "PENDING",
                    userId,
                    documentUrl: `/uploads/${filename}`,
                    documentType: file.mimetype
                },
                create: {
                    phone,
                    status: "PENDING",
                    userId,
                    documentUrl: `/uploads/${filename}`,
                    documentType: file.mimetype
                }
            });
        }
        (0, memory_store_1.seedMemory)();
        return { status: "uploaded", filename: file?.originalname };
    }
    async status(userId) {
        if (!userId)
            return { phone: "PENDING", steward: "PENDING" };
        if (!(0, memory_store_1.useMemory)()) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const verification = await this.prisma.verification.findFirst({
                where: { userId }
            });
            return {
                phone: verification?.status ?? "PENDING",
                steward: user?.stewardStatus ?? "PENDING"
            };
        }
        (0, memory_store_1.seedMemory)();
        const user = memory_store_1.memoryStore.users.find((u) => u.id === userId);
        return { phone: "PENDING", steward: user?.stewardStatus ?? "PENDING" };
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
