import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  health() {
    return { status: "ok" };
  }

  @Get("health/ready")
  async readiness() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: "ready" };
  }
}
