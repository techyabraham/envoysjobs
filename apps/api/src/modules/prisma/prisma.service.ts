import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    const connect = this.$connect();
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Prisma connect timeout")), 3000)
    );
    try {
      await Promise.race([connect, timeout]);
    } catch (error) {
      console.warn(
        "[Prisma] Database connection skipped or timed out. API will start, but DB operations may fail.",
        error
      );
    }
  }
}
