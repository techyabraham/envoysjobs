import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { memoryStore, seedMemory, useMemory } from "../../common/memory.store";
import { StorageService } from "../../common/storage.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private storage: StorageService) {}

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

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) return { error: "No file uploaded" };
    const stored = await this.storage.save(file, "avatars");
    const imageUrl = stored.url;
    await this.updateUser(userId, { imageUrl });
    return { imageUrl };
  }

  getEnvoyProfile(userId: string) {
    if (!useMemory()) {
      return this.prisma.envoyProfile.findUnique({
        where: { userId },
        include: { user: true }
      });
    }
    return this.prisma.envoyProfile.findUnique({ where: { userId } }).catch(() => {
      return {
        userId,
        bio: "Envoy profile",
        location: "Lagos",
        availability: "Full-time",
        portfolioLinks: "",
        rating: 4.8,
        verified: false,
        user: memoryStore.users.find((u) => u.id === userId)
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
    if (!useMemory()) {
      return this.prisma.hirerProfile.findUnique({
        where: { userId },
        include: { user: true }
      });
    }
    return this.prisma.hirerProfile.findUnique({ where: { userId } }).catch(() => {
      return {
        userId,
        type: "INDIVIDUAL",
        businessName: null,
        isRecruiter: false,
        recruiterIndustries: [],
        recruiterSkills: [],
        rating: 4.5,
        user: memoryStore.users.find((u) => u.id === userId)
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
