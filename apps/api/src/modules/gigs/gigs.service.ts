import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ContactMethod } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GigsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    title: string;
    description: string;
    amount: string;
    location: string;
    duration: string;
    urgent?: boolean;
    postedById: string;
    contactMethods?: ContactMethod[];
    contactEmail?: string;
    contactWebsite?: string;
    contactWhatsapp?: string;
  }) {
    const contactMethods = data.contactMethods?.length ? data.contactMethods : [ContactMethod.PLATFORM];
    return this.prisma.gig.create({
      data: {
        ...data,
        contactMethods,
        status: "AVAILABLE",
        urgent: data.urgent ?? false
      }
    });
  }

  list({ excludeMine, userId }: { excludeMine: boolean; userId?: string }) {
    const where = excludeMine && userId ? { postedById: { not: userId } } : {};
    return this.prisma.gig.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { postedBy: true }
    });
  }

  listByUser(userId: string) {
    return this.prisma.gig.findMany({
      where: { postedById: userId },
      orderBy: { createdAt: "desc" }
    });
  }

  listApplied(userId: string) {
    return this.prisma.gigApplication.findMany({
      where: { applicantId: userId },
      orderBy: { createdAt: "desc" },
      include: { gig: { include: { postedBy: true } } }
    });
  }

  get(id: string) {
    return this.prisma.gig.findUnique({ where: { id }, include: { postedBy: true } });
  }

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      amount?: string;
      location?: string;
      duration?: string;
      urgent?: boolean;
      contactMethods?: ContactMethod[];
      contactEmail?: string;
      contactWebsite?: string;
      contactWhatsapp?: string;
    }
  ) {
    const existing = await this.prisma.gig.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Gig not found");
    if (existing.postedById !== userId) {
      const actor = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
      if (actor?.role !== "ADMIN") throw new ForbiddenException("Not allowed");
    }

    return this.prisma.gig.update({
      where: { id },
      data: {
        ...data,
        contactMethods: data.contactMethods?.length ? data.contactMethods : undefined
      }
    });
  }

  async apply(gigId: string, applicantId: string, counterBudget?: string) {
    const existingGig = await this.prisma.gig.findUnique({ where: { id: gigId } });
    if (!existingGig) throw new NotFoundException("Gig not found");
    if (existingGig.postedById === applicantId) throw new ForbiddenException("Cannot apply to your own gig");

    return this.prisma.gigApplication.upsert({
      where: { gigId_applicantId: { gigId, applicantId } },
      update: { status: "APPLIED", counterBudget },
      create: { gigId, applicantId, status: "APPLIED", counterBudget }
    });
  }
}
