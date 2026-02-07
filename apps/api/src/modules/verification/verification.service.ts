import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!userId) return { status: "missing-user" };
    if (!useMemory()) {
      return this.prisma.verification.upsert({
        where: { phone: userId },
        update: { status: "PENDING" },
        create: { phone: userId, status: "PENDING" }
      });
    }
    seedMemory();
    return { status: "uploaded", filename: file?.originalname };
  }

  async status(userId: string) {
    if (!userId) return { phone: "PENDING", steward: "PENDING" };
    if (!useMemory()) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const verification = await this.prisma.verification.findFirst({
        where: { phone: userId }
      });
      return {
        phone: verification?.status ?? "PENDING",
        steward: user?.stewardStatus ?? "PENDING"
      };
    }
    seedMemory();
    const user = memoryStore.users.find((u) => u.id === userId);
    return { phone: "PENDING", steward: user?.stewardStatus ?? "PENDING" };
  }
}
