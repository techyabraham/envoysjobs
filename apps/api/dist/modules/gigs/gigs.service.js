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
exports.GigsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let GigsService = class GigsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        const contactMethods = data.contactMethods?.length ? data.contactMethods : [client_1.ContactMethod.PLATFORM];
        return this.prisma.gig.create({
            data: {
                ...data,
                contactMethods,
                status: "AVAILABLE",
                urgent: data.urgent ?? false
            }
        });
    }
    list({ excludeMine, userId }) {
        const where = excludeMine && userId ? { postedById: { not: userId } } : {};
        return this.prisma.gig.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { postedBy: true }
        });
    }
    listByUser(userId) {
        return this.prisma.gig.findMany({
            where: { postedById: userId },
            orderBy: { createdAt: "desc" }
        });
    }
    listApplied(userId) {
        return this.prisma.gigApplication.findMany({
            where: { applicantId: userId },
            orderBy: { createdAt: "desc" },
            include: { gig: { include: { postedBy: true } } }
        });
    }
    get(id) {
        return this.prisma.gig.findUnique({ where: { id }, include: { postedBy: true } });
    }
    async update(id, userId, data) {
        const existing = await this.prisma.gig.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException("Gig not found");
        if (existing.postedById !== userId) {
            const actor = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });
            if (actor?.role !== "ADMIN")
                throw new common_1.ForbiddenException("Not allowed");
        }
        return this.prisma.gig.update({
            where: { id },
            data: {
                ...data,
                contactMethods: data.contactMethods?.length ? data.contactMethods : undefined
            }
        });
    }
    async apply(gigId, applicantId, counterBudget) {
        const existingGig = await this.prisma.gig.findUnique({ where: { id: gigId } });
        if (!existingGig)
            throw new common_1.NotFoundException("Gig not found");
        if (existingGig.postedById === applicantId)
            throw new common_1.ForbiddenException("Cannot apply to your own gig");
        return this.prisma.gigApplication.upsert({
            where: { gigId_applicantId: { gigId, applicantId } },
            update: { status: "APPLIED", counterBudget },
            create: { gigId, applicantId, status: "APPLIED", counterBudget }
        });
    }
};
exports.GigsService = GigsService;
exports.GigsService = GigsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GigsService);
