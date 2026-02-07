import { Injectable } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  apply(jobId: string, userId: string) {
    if (!useMemory()) {
      return this.prisma.application.create({
        data: {
          jobId,
          envoyId: userId,
          status: ApplicationStatus.APPLIED
        }
      });
    }
    seedMemory();
    return this.prisma.application
      .create({
        data: {
          jobId,
          envoyId: userId,
          status: ApplicationStatus.APPLIED
        }
      })
      .catch(() => {
        const application = {
          id: createId(),
          jobId,
          envoyId: userId,
          status: ApplicationStatus.APPLIED,
          createdAt: new Date()
        };
        memoryStore.applications.push(application as any);
        return application;
      });
  }

  list(userId: string) {
    if (!useMemory()) {
      return this.prisma.application.findMany({
        where: {
          OR: [{ envoyId: userId }, { job: { hirerId: userId } }]
        }
      });
    }
    seedMemory();
    return this.prisma.application
      .findMany({
        where: {
          OR: [{ envoyId: userId }, { job: { hirerId: userId } }]
        }
      })
      .catch(() => {
        return memoryStore.applications.filter((app) => {
          if (app.envoyId === userId) return true;
          const job = memoryStore.jobs.find((j) => j.id === app.jobId);
          return job?.hirerId === userId;
        });
      });
  }

  updateStatus(id: string, status: ApplicationStatus) {
    if (!useMemory()) return this.prisma.application.update({ where: { id }, data: { status } });
    seedMemory();
    return this.prisma.application.update({ where: { id }, data: { status } }).catch(() => {
      const index = memoryStore.applications.findIndex((app) => app.id === id);
      if (index === -1) return null;
      memoryStore.applications[index] = { ...memoryStore.applications[index], status } as any;
      return memoryStore.applications[index];
    });
  }
}
