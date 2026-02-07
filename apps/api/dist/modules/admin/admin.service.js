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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    users() {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.user.findMany();
        (0, memory_store_1.seedMemory)();
        return this.prisma.user.findMany().catch(() => memory_store_1.memoryStore.users);
    }
    jobs() {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.job.findMany();
        (0, memory_store_1.seedMemory)();
        return this.prisma.job.findMany().catch(() => memory_store_1.memoryStore.jobs);
    }
    reports() {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.report.findMany();
        return this.prisma.report.findMany().catch(() => []);
    }
    verifications() {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.verification.findMany();
        return this.prisma.verification.findMany().catch(() => []);
    }
    updateVerification(id, status) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.$transaction([
                this.prisma.verification.update({ where: { id }, data: { status } }),
                this.prisma.adminAuditLog.create({
                    data: { adminId: "system", action: `Verification ${id} -> ${status}` }
                })
            ]);
        }
        return this.prisma
            .$transaction([
            this.prisma.verification.update({ where: { id }, data: { status } }),
            this.prisma.adminAuditLog.create({
                data: { adminId: "system", action: `Verification ${id} -> ${status}` }
            })
        ])
            .catch(() => [{ id, status }, { id: "audit", action: `Verification ${id} -> ${status}` }]);
    }
    updateSteward(userId, status) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.$transaction([
                this.prisma.user.update({
                    where: { id: userId },
                    data: { stewardStatus: status }
                }),
                this.prisma.adminAuditLog.create({
                    data: { adminId: "system", action: `Steward ${userId} -> ${status}` }
                })
            ]);
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma
            .$transaction([
            this.prisma.user.update({
                where: { id: userId },
                data: { stewardStatus: status }
            }),
            this.prisma.adminAuditLog.create({
                data: { adminId: "system", action: `Steward ${userId} -> ${status}` }
            })
        ])
            .catch(() => {
            const user = memory_store_1.memoryStore.users.find((u) => u.id === userId);
            if (user)
                user.stewardStatus = status;
            return [user, { id: "audit", action: `Steward ${userId} -> ${status}` }];
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
