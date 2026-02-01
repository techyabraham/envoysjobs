import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  apply(jobId: string, userId: string) {
    return this.prisma.application.create({
      data: {
        jobId,
        envoyId: userId,
        status: "APPLIED"
      }
    });
  }

  list(userId: string) {
    return this.prisma.application.findMany({
      where: {
        OR: [{ envoyId: userId }, { job: { hirerId: userId } }]
      }
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.application.update({ where: { id }, data: { status } });
  }
}
