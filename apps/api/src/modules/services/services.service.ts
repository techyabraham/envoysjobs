import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
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
      where: { id }
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
}
