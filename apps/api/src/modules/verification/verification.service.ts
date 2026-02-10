import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { memoryStore, seedMemory, useMemory } from "../../common/memory.store";
import { promises as fs } from "fs";
import path from "path";

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!userId) return { status: "missing-user" };
    if (!useMemory()) {
      const uploadsDir = path.join(process.cwd(), "apps/api/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filename = `${userId}-${Date.now()}-${file.originalname}`.replace(/\\s+/g, "_");
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, file.buffer);

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const phone = user?.phone || userId;

      return this.prisma.verification.upsert({
        where: { phone },
        update: {
          status: "PENDING",
          userId,
          documentUrl: `/uploads/${filename}`,
          documentType: file.mimetype
        },
        create: {
          phone,
          status: "PENDING",
          userId,
          documentUrl: `/uploads/${filename}`,
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
