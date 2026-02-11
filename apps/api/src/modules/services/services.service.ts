import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import fs from "fs/promises";
import path from "path";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(data: { title: string; description: string; rate: string; envoyId: string }) {
    return this.prisma.service.create({
      data: {
        ...data,
        status: "PENDING"
      }
    });
  }

  listByEnvoy(envoyId: string) {
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

  get(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include: { envoy: true }
    });
  }

  async update(id: string, envoyId: string, data: { title?: string; description?: string; rate?: string }) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Service not found");
    if (existing.envoyId !== envoyId) throw new ForbiddenException("Not allowed");

    return this.prisma.service.update({
      where: { id },
      data
    });
  }

  async uploadImage(id: string, envoyId: string, file: Express.Multer.File) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Service not found");
    if (existing.envoyId !== envoyId) throw new ForbiddenException("Not allowed");
    if (!file) throw new NotFoundException("No file uploaded");

    const uploadsDir = path.join(process.cwd(), "apps/api/uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `service-${id}-${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, file.buffer);
    const imageUrl = `/uploads/${filename}`;

    return this.prisma.service.update({
      where: { id },
      data: { imageUrl }
    });
  }
}
