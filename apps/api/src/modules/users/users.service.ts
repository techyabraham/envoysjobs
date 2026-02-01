import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  updateUser(userId: string, data: any) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  getEnvoyProfile(userId: string) {
    return this.prisma.envoyProfile.findUnique({ where: { userId } });
  }

  updateEnvoyProfile(userId: string, data: any) {
    return this.prisma.envoyProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }

  getHirerProfile(userId: string) {
    return this.prisma.hirerProfile.findUnique({ where: { userId } });
  }

  updateHirerProfile(userId: string, data: any) {
    return this.prisma.hirerProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }
}
