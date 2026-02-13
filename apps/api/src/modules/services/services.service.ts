import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import fs from "fs/promises";
import path from "path";
import { ContactMethod } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    title: string;
    description: string;
    rate: string;
    envoyId: string;
    contactMethods?: ContactMethod[];
    contactEmail?: string;
    contactWebsite?: string;
    contactWhatsapp?: string;
  }) {
    const contactMethods = data.contactMethods?.length ? data.contactMethods : [ContactMethod.PLATFORM];
    return this.prisma.service.create({
      data: {
        ...data,
        contactMethods,
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

  listAll(q?: string) {
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

  get(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include: { envoy: true }
    });
  }

  async update(
    id: string,
    envoyId: string,
    data: {
      title?: string;
      description?: string;
      rate?: string;
      contactMethods?: ContactMethod[];
      contactEmail?: string;
      contactWebsite?: string;
      contactWhatsapp?: string;
    }
  ) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Service not found");
    if (existing.envoyId !== envoyId) {
      const actor = await this.prisma.user.findUnique({
        where: { id: envoyId },
        select: { role: true }
      });
      if (actor?.role !== "ADMIN") throw new ForbiddenException("Not allowed");
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...data,
        contactMethods: data.contactMethods?.length ? data.contactMethods : existing.contactMethods
      }
    });
  }

  async uploadImage(id: string, envoyId: string, file: Express.Multer.File) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Service not found");
    if (existing.envoyId !== envoyId) {
      const actor = await this.prisma.user.findUnique({
        where: { id: envoyId },
        select: { role: true }
      });
      if (actor?.role !== "ADMIN") throw new ForbiddenException("Not allowed");
    }
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

  async inquire(
    serviceId: string,
    customerId: string,
    data: { method?: ContactMethod; message?: string }
  ) {
    const existing = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!existing) throw new NotFoundException("Service not found");
    if (!customerId) throw new NotFoundException("Customer not found");
    return this.prisma.serviceInquiry.create({
      data: {
        serviceId,
        customerId,
        method: data.method ?? ContactMethod.PLATFORM,
        message: data.message
      }
    });
  }
}
