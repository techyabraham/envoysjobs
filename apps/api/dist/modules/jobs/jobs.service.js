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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
let JobsService = class JobsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.job.create({ data });
        (0, memory_store_1.seedMemory)();
        return this.prisma.job.create({ data }).catch(() => {
            const job = {
                id: (0, memory_store_1.createId)(),
                ...data,
                status: data.status ?? "DRAFT",
                createdAt: new Date()
            };
            memory_store_1.memoryStore.jobs.push(job);
            return job;
        });
    }
    list(query) {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.job.findMany({ where: query });
        (0, memory_store_1.seedMemory)();
        return this.prisma.job.findMany({ where: query }).catch(() => {
            if (!query || Object.keys(query).length === 0)
                return memory_store_1.memoryStore.jobs;
            return memory_store_1.memoryStore.jobs.filter((job) => {
                return Object.entries(query).every(([key, value]) => job[key] === value);
            });
        });
    }
    get(id) {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.job.findUnique({ where: { id } });
        (0, memory_store_1.seedMemory)();
        return this.prisma.job.findUnique({ where: { id } }).catch(() => {
            return memory_store_1.memoryStore.jobs.find((job) => job.id === id) ?? null;
        });
    }
    update(id, data) {
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.job.update({ where: { id }, data });
        (0, memory_store_1.seedMemory)();
        return this.prisma.job.update({ where: { id }, data }).catch(() => {
            const index = memory_store_1.memoryStore.jobs.findIndex((job) => job.id === id);
            if (index === -1)
                return null;
            memory_store_1.memoryStore.jobs[index] = { ...memory_store_1.memoryStore.jobs[index], ...data };
            return memory_store_1.memoryStore.jobs[index];
        });
    }
    publish(id) {
        return this.update(id, { status: "PUBLISHED" });
    }
    close(id) {
        return this.update(id, { status: "CLOSED" });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
