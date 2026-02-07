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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
let VerificationService = class VerificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upload(userId, file) {
        if (!userId)
            return { status: "missing-user" };
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.verification.upsert({
                where: { phone: userId },
                update: { status: "PENDING" },
                create: { phone: userId, status: "PENDING" }
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
                where: { phone: userId }
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
