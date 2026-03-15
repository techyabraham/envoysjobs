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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../../common/storage.service");
let ServicesService = class ServicesService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    create(data) {
        const contactMethods = data.contactMethods?.length ? data.contactMethods : [client_1.ContactMethod.PLATFORM];
        return this.prisma.service.create({
            data: {
                ...data,
                contactMethods,
                status: "PENDING"
            }
        });
    }
    listByEnvoy(envoyId) {
        return this.prisma.service.findMany({
            where: { envoyId },
            orderBy: { createdAt: "desc" }
        });
    }
    listAll(q) {
        const query = q?.trim();
        return this.prisma.service.findMany({
            where: query
                ? {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                        { rate: { contains: query, mode: "insensitive" } },
                        {
                            envoy: {
                                OR: [
                                    { firstName: { contains: query, mode: "insensitive" } },
                                    { lastName: { contains: query, mode: "insensitive" } }
                                ]
                            }
                        }
                    ]
                }
                : undefined,
            orderBy: { createdAt: "desc" },
            include: { envoy: true }
        });
    }
    get(id) {
        return this.prisma.service.findUnique({
            where: { id },
            include: { envoy: true }
        });
    }
    async update(id, envoyId, data) {
        const existing = await this.prisma.service.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException("Service not found");
        if (existing.envoyId !== envoyId) {
            const actor = await this.prisma.user.findUnique({
                where: { id: envoyId },
                select: { role: true }
            });
            if (actor?.role !== "ADMIN")
                throw new common_1.ForbiddenException("Not allowed");
        }
        return this.prisma.service.update({
            where: { id },
            data: {
                ...data,
                contactMethods: data.contactMethods?.length ? data.contactMethods : existing.contactMethods
            }
        });
    }
    async uploadImage(id, envoyId, file) {
        const existing = await this.prisma.service.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException("Service not found");
        if (existing.envoyId !== envoyId) {
            const actor = await this.prisma.user.findUnique({
                where: { id: envoyId },
                select: { role: true }
            });
            if (actor?.role !== "ADMIN")
                throw new common_1.ForbiddenException("Not allowed");
        }
        if (!file)
            throw new common_1.NotFoundException("No file uploaded");
        const stored = await this.storage.save(file, "services");
        return this.prisma.service.update({
            where: { id },
            data: { imageUrl: stored.url }
        });
    }
    async inquire(serviceId, customerId, data) {
        const existing = await this.prisma.service.findUnique({ where: { id: serviceId } });
        if (!existing)
            throw new common_1.NotFoundException("Service not found");
        if (!customerId)
            throw new common_1.NotFoundException("Customer not found");
        return this.prisma.serviceInquiry.create({
            data: {
                serviceId,
                customerId,
                method: data.method ?? client_1.ContactMethod.PLATFORM,
                message: data.message
            }
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, storage_service_1.StorageService])
], ServicesService);
