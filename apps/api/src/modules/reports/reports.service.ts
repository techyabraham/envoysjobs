import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  create(reporterId: string, reason: string) {
    if (!useMemory()) {
      return this.prisma.report.create({
        data: { reporterId, reason }
      });
    }
    seedMemory();
    return this.prisma.report
      .create({ data: { reporterId, reason } })
      .catch(() => {
        const report = { id: createId(), reporterId, reason, createdAt: new Date() } as any;
        if (!memoryStore.reports) memoryStore.reports = [] as any;
        memoryStore.reports.push(report);
        return report;
      });
  }
}
