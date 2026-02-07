import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    if (!useMemory()) return this.prisma.job.create({ data });
    seedMemory();
    return this.prisma.job.create({ data }).catch(() => {
      const job = {
        id: createId(),
        ...data,
        status: data.status ?? "DRAFT",
        createdAt: new Date()
      };
      memoryStore.jobs.push(job);
      return job;
    });
  }

  list(query: any) {
    if (!useMemory()) return this.prisma.job.findMany({ where: query });
    seedMemory();
    return this.prisma.job.findMany({ where: query }).catch(() => {
      if (!query || Object.keys(query).length === 0) return memoryStore.jobs;
      return memoryStore.jobs.filter((job) => {
        return Object.entries(query).every(([key, value]) => (job as any)[key] === value);
      });
    });
  }

  get(id: string) {
    if (!useMemory()) return this.prisma.job.findUnique({ where: { id } });
    seedMemory();
    return this.prisma.job.findUnique({ where: { id } }).catch(() => {
      return memoryStore.jobs.find((job) => job.id === id) ?? null;
    });
  }

  update(id: string, data: any) {
    if (!useMemory()) return this.prisma.job.update({ where: { id }, data });
    seedMemory();
    return this.prisma.job.update({ where: { id }, data }).catch(() => {
      const index = memoryStore.jobs.findIndex((job) => job.id === id);
      if (index === -1) return null;
      memoryStore.jobs[index] = { ...memoryStore.jobs[index], ...data };
      return memoryStore.jobs[index];
    });
  }

  publish(id: string) {
    return this.update(id, { status: "PUBLISHED" });
  }

  close(id: string) {
    return this.update(id, { status: "CLOSED" });
  }

  async saveJob(userId: string, jobId: string) {
    if (!useMemory()) {
      return this.prisma.savedJob.upsert({
        where: { userId_jobId: { userId, jobId } },
        update: {},
        create: { userId, jobId }
      });
    }
    seedMemory();
    const existing = memoryStore.savedJobs.find((s) => s.userId === userId && s.jobId === jobId);
    if (existing) return existing as any;
    const saved = { id: createId(), userId, jobId, createdAt: new Date() };
    memoryStore.savedJobs.push(saved);
    return saved as any;
  }

  async unsaveJob(userId: string, jobId: string) {
    if (!useMemory()) {
      return this.prisma.savedJob.delete({
        where: { userId_jobId: { userId, jobId } }
      });
    }
    seedMemory();
    memoryStore.savedJobs = memoryStore.savedJobs.filter((s) => !(s.userId === userId && s.jobId === jobId));
    return { success: true };
  }

  async listSavedJobs(userId: string) {
    if (!useMemory()) {
      const saved = await this.prisma.savedJob.findMany({
        where: { userId },
        include: { job: true }
      });
      return saved.map((s) => s.job);
    }
    seedMemory();
    const saved = memoryStore.savedJobs.filter((s) => s.userId === userId);
    return saved.map((s) => memoryStore.jobs.find((j) => j.id === s.jobId)).filter(Boolean);
  }
}
