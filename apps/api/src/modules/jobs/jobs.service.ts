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
}
