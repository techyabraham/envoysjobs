import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    if (!useMemory()) {
      return this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });
    }
    seedMemory();
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }).catch(() => {
      return memoryStore.notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });
  }

  async read(userId: string, id: string) {
    if (!useMemory()) {
      const existing = await this.prisma.notification.findFirst({
        where: { id, userId }
      });
      if (!existing) return null;
      return this.prisma.notification.update({
        where: { id: existing.id },
        data: { read: true }
      });
    }
    seedMemory();
    const notification = memoryStore.notifications.find((n) => n.id === id && n.userId === userId);
    if (!notification) return null;
    notification.read = true;
    return notification;
  }
}
