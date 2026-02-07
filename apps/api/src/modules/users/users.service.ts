import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUser(userId: string) {
    if (!useMemory()) return this.prisma.user.findUnique({ where: { id: userId } });
    seedMemory();
    return this.prisma.user.findUnique({ where: { id: userId } }).catch(() => {
      return memoryStore.users.find((u) => u.id === userId) ?? null;
    });
  }

  updateUser(userId: string, data: any) {
    if (!useMemory()) return this.prisma.user.update({ where: { id: userId }, data });
    seedMemory();
    return this.prisma.user.update({ where: { id: userId }, data }).catch(() => {
      const index = memoryStore.users.findIndex((u) => u.id === userId);
      if (index === -1) return null;
      memoryStore.users[index] = { ...memoryStore.users[index], ...data };
      return memoryStore.users[index];
    });
  }

  getEnvoyProfile(userId: string) {
    if (!useMemory()) return this.prisma.envoyProfile.findUnique({ where: { userId } });
    return this.prisma.envoyProfile.findUnique({ where: { userId } }).catch(() => {
      return {
        userId,
        bio: "Envoy profile",
        location: "Lagos",
        availability: "Full-time",
        portfolioLinks: "",
        rating: 4.8,
        verified: false
      } as any;
    });
  }

  updateEnvoyProfile(userId: string, data: any) {
    if (!useMemory()) {
      return this.prisma.envoyProfile.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data }
      });
    }
    return this.prisma.envoyProfile
      .upsert({
        where: { userId },
        update: data,
        create: { userId, ...data }
      })
      .catch(() => ({ userId, ...data }));
  }

  getHirerProfile(userId: string) {
    if (!useMemory()) return this.prisma.hirerProfile.findUnique({ where: { userId } });
    return this.prisma.hirerProfile.findUnique({ where: { userId } }).catch(() => {
      return {
        userId,
        type: "INDIVIDUAL",
        businessName: null,
        rating: 4.5
      } as any;
    });
  }

  updateHirerProfile(userId: string, data: any) {
    if (!useMemory()) {
      return this.prisma.hirerProfile.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data }
      });
    }
    return this.prisma.hirerProfile
      .upsert({
        where: { userId },
        update: data,
        create: { userId, ...data }
      })
      .catch(() => ({ userId, ...data }));
  }
}
