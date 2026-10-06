import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ContactMethod } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

type DealInput = {
  title?: string;
  description?: string;
  offer?: string;
  category?: string;
  promoCode?: string;
  redemptionInstructions?: string;
  location?: string;
  startsAt?: string;
  endsAt?: string;
  contactMethods?: ContactMethod[];
  contactEmail?: string;
  contactWebsite?: string;
  contactWhatsapp?: string;
};

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  listActive(q?: string, category?: string) {
    const now = new Date();
    const search = q?.trim();
    return this.prisma.deal.findMany({
      where: {
        status: "ACTIVE",
        AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
        ...(category ? { category } : {}),
        ...(search ? { OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { offer: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } }
        ] } : {})
      },
      orderBy: [{ endsAt: "asc" }, { createdAt: "desc" }],
      include: { owner: { select: { id: true, firstName: true, lastName: true } } }
    });
  }

  listMine(ownerId: string) {
    return this.prisma.deal.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
  }

  create(ownerId: string, data: DealInput) {
    const contactMethods = data.contactMethods?.length
      ? data.contactMethods
      : [
          ...(data.contactEmail ? [ContactMethod.EMAIL] : []),
          ...(data.contactWebsite ? [ContactMethod.WEBSITE] : []),
          ...(data.contactWhatsapp ? [ContactMethod.WHATSAPP] : [])
        ];
    return this.prisma.deal.create({
      data: {
        ...this.toPrismaData(data),
        ownerId,
        contactMethods,
        status: "PENDING"
      }
    });
  }

  async get(id: string, userId: string, role?: string) {
    const deal = await this.prisma.deal.findUnique({ where: { id }, include: { owner: { select: { id: true, firstName: true, lastName: true } } } });
    if (!deal) throw new NotFoundException("Deal not found");
    if (role !== "ADMIN" && deal.ownerId !== userId && (deal.status !== "ACTIVE" || (deal.endsAt && deal.endsAt <= new Date()) || (deal.startsAt && deal.startsAt > new Date()))) {
      throw new NotFoundException("Deal not found");
    }
    return deal;
  }

  async update(id: string, ownerId: string, data: DealInput) {
    const existing = await this.prisma.deal.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Deal not found");
    if (existing.ownerId !== ownerId) {
      const actor = await this.prisma.user.findUnique({ where: { id: ownerId }, select: { role: true } });
      if (actor?.role !== "ADMIN") throw new ForbiddenException("Not allowed");
    }
    return this.prisma.deal.update({
      where: { id },
      data: { ...this.toPrismaData(data), ...(existing.status === "REJECTED" ? { status: "PENDING" } : {}) }
    });
  }

  async updateOwnStatus(id: string, ownerId: string, status: "ACTIVE" | "PAUSED") {
    const existing = await this.prisma.deal.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Deal not found");
    if (existing.ownerId !== ownerId) throw new ForbiddenException("Not allowed");
    if (existing.status !== "ACTIVE" && existing.status !== "PAUSED") {
      throw new ForbiddenException("Only approved deals can be paused or reactivated.");
    }
    return this.prisma.deal.update({ where: { id }, data: { status } });
  }

  private toPrismaData(data: DealInput) {
    return {
      ...data,
      startsAt: data.startsAt === undefined ? undefined : data.startsAt ? new Date(data.startsAt) : null,
      endsAt: data.endsAt === undefined ? undefined : data.endsAt ? new Date(data.endsAt) : null
    };
  }
}
