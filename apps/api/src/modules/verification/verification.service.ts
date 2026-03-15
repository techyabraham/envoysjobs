import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { memoryStore, seedMemory, useMemory } from "../../common/memory.store";
import { StorageService } from "../../common/storage.service";

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService, private storage: StorageService) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!userId) return { status: "missing-user" };
    if (!useMemory()) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const phone = user?.phone || userId;
      const stored = await this.storage.save(file, "verification");

      return this.prisma.verification.upsert({
        where: { phone },
        update: {
          status: "PENDING",
          userId,
          documentUrl: stored.url,
          documentType: file.mimetype
        },
        create: {
          phone,
          status: "PENDING",
          userId,
          documentUrl: stored.url,
          documentType: file.mimetype
        }
      });
    }
    seedMemory();
    return { status: "uploaded", filename: file?.originalname };
  }

  async status(userId: string) {
    if (!userId) return { phone: "PENDING", steward: "NOT_APPLICABLE" };
    if (!useMemory()) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const verification = await this.prisma.verification.findFirst({
        where: { userId }
      });
      return {
        phone: verification?.status ?? "PENDING",
        steward: user?.stewardStatus ?? "NOT_APPLICABLE"
      };
    }
    seedMemory();
    const user = memoryStore.users.find((u) => u.id === userId);
    return { phone: "PENDING", steward: user?.stewardStatus ?? "NOT_APPLICABLE" };
  }
}
