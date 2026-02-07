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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
let ApplicationsService = class ApplicationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    apply(jobId, userId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.application.create({
                data: {
                    jobId,
                    envoyId: userId,
                    status: client_1.ApplicationStatus.APPLIED
                }
            });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.application
            .create({
            data: {
                jobId,
                envoyId: userId,
                status: client_1.ApplicationStatus.APPLIED
            }
        })
            .catch(() => {
            const application = {
                id: (0, memory_store_1.createId)(),
                jobId,
                envoyId: userId,
                status: client_1.ApplicationStatus.APPLIED,
                createdAt: new Date()
            };
            memory_store_1.memoryStore.applications.push(application);
            return application;
        });
    }
    list(userId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.application.findMany({
                where: {
                    OR: [{ envoyId: userId }, { job: { hirerId: userId } }]
                }
            });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.application
            .findMany({
            where: {
                OR: [{ envoyId: userId }, { job: { hirerId: userId } }]
            }
        })
            .catch(() => {
            return memory_store_1.memoryStore.applications.filter((app) => {
                if (app.envoyId === userId)
                    return true;
                const job = memory_store_1.memoryStore.jobs.find((j) => j.id === app.jobId);
                return job?.hirerId === userId;
            });
        });
    }
    updateStatus(id, status) {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.application.update({ where: { id }, data: { status } });
        (0, memory_store_1.seedMemory)();
        return this.prisma.application.update({ where: { id }, data: { status } }).catch(() => {
            const index = memory_store_1.memoryStore.applications.findIndex((app) => app.id === id);
            if (index === -1)
                return null;
            memory_store_1.memoryStore.applications[index] = { ...memory_store_1.memoryStore.applications[index], status };
            return memory_store_1.memoryStore.applications[index];
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
