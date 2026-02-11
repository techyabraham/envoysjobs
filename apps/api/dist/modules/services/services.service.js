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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.service.create({
            data: {
                ...data,
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
    listAll() {
        return this.prisma.service.findMany({
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
        if (existing.envoyId !== envoyId)
            throw new common_1.ForbiddenException("Not allowed");
        return this.prisma.service.update({
            where: { id },
            data
        });
    }
    async uploadImage(id, envoyId, file) {
        const existing = await this.prisma.service.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException("Service not found");
        if (existing.envoyId !== envoyId)
            throw new common_1.ForbiddenException("Not allowed");
        if (!file)
            throw new common_1.NotFoundException("No file uploaded");
        const uploadsDir = path_1.default.join(process.cwd(), "apps/api/uploads");
        await promises_1.default.mkdir(uploadsDir, { recursive: true });
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filename = `service-${id}-${Date.now()}-${safeName}`;
        const filePath = path_1.default.join(uploadsDir, filename);
        await promises_1.default.writeFile(filePath, file.buffer);
        const imageUrl = `/uploads/${filename}`;
        return this.prisma.service.update({
            where: { id },
            data: { imageUrl }
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
