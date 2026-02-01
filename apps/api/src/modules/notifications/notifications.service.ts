import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.notification.findMany({ orderBy: { createdAt: "desc" } });
  }

  read(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }
}
