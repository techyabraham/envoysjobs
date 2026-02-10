import { Injectable } from "@nestjs/common";
import { ApplicationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService, private notifications: NotificationsService) {}

  apply(jobId: string, userId: string) {
    if (!useMemory()) {
      return this.prisma.application.create({
        data: {
          jobId,
          envoyId: userId,
          status: ApplicationStatus.APPLIED
        }
      }).then(async (app) => {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (job?.hirerId) {
          await this.notifications.create(job.hirerId, "New application", "You received a new application.");
        }
        return app;
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
        const job = memoryStore.jobs.find((j) => j.id === jobId);
        if (job?.hirerId) {
          this.notifications.create(job.hirerId, "New application", "You received a new application.");
        }
        return application;
      });
  }

  list(userId: string, jobId?: string) {
    if (!useMemory()) {
      return this.prisma.application.findMany({
        where: {
          OR: [{ envoyId: userId }, { job: { hirerId: userId } }],
          ...(jobId ? { jobId } : {})
        },
        include: {
          job: true,
          envoy: true
        }
      });
    }
    seedMemory();
    return this.prisma.application
      .findMany({
        where: {
          OR: [{ envoyId: userId }, { job: { hirerId: userId } }],
          ...(jobId ? { jobId } : {})
        },
        include: {
          job: true,
          envoy: true
        }
      })
      .catch(() => {
        return memoryStore.applications.filter((app) => {
          if (app.envoyId === userId) return true;
          const job = memoryStore.jobs.find((j) => j.id === app.jobId);
          return job?.hirerId === userId;
        }).filter((app) => (jobId ? app.jobId === jobId : true))
          .map((app) => {
            const job = memoryStore.jobs.find((j) => j.id === app.jobId);
            const envoy = memoryStore.users.find((u) => u.id === app.envoyId);
            return { ...app, job, envoy } as any;
          });
      });
  }

  updateStatus(id: string, status: ApplicationStatus) {
    if (!useMemory()) {
      return this.prisma.application.update({ where: { id }, data: { status } }).then(async (app) => {
        await this.notifications.create(app.envoyId, "Application update", `Your application is now ${status}.`);
        return app;
      });
    }
    seedMemory();
    return this.prisma.application.update({ where: { id }, data: { status } }).catch(() => {
      const index = memoryStore.applications.findIndex((app) => app.id === id);
      if (index === -1) return null;
      memoryStore.applications[index] = { ...memoryStore.applications[index], status } as any;
      const app = memoryStore.applications[index];
      this.notifications.create(app.envoyId, "Application update", `Your application is now ${status}.`);
      return memoryStore.applications[index];
    });
  }
}
