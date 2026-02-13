import { Injectable } from "@nestjs/common";
import { ContactMethod, JobStatus, StewardStatus, VerificationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  users() {
    if (!useMemory()) return this.prisma.user.findMany();
    seedMemory();
    return this.prisma.user.findMany().catch(() => memoryStore.users);
  }

  jobs() {
    if (!useMemory()) return this.prisma.job.findMany();
    seedMemory();
    return this.prisma.job.findMany().catch(() => memoryStore.jobs);
  }

  reports() {
    if (!useMemory()) return this.prisma.report.findMany();
    return this.prisma.report.findMany().catch(() => []);
  }

  verifications() {
    if (!useMemory()) return this.prisma.verification.findMany();
    return this.prisma.verification.findMany().catch(() => []);
  }

  updateVerification(id: string, status: VerificationStatus) {
    if (!useMemory()) {
      return this.prisma.$transaction([
        this.prisma.verification.update({ where: { id }, data: { status } }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Verification ${id} -> ${status}` }
        })
      ]);
    }
    return this.prisma
      .$transaction([
        this.prisma.verification.update({ where: { id }, data: { status } }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Verification ${id} -> ${status}` }
        })
      ])
      .catch(() => [{ id, status }, { id: "audit", action: `Verification ${id} -> ${status}` }]);
  }

  updateSteward(userId: string, status: StewardStatus) {
    if (!useMemory()) {
      return this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: { stewardStatus: status }
        }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Steward ${userId} -> ${status}` }
        })
      ]);
    }
    seedMemory();
    return this.prisma
      .$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: { stewardStatus: status }
        }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Steward ${userId} -> ${status}` }
        })
      ])
      .catch(() => {
        const user = memoryStore.users.find((u) => u.id === userId);
        if (user) user.stewardStatus = status;
        return [user, { id: "audit", action: `Steward ${userId} -> ${status}` }];
      });
  }

  updateJobStatus(id: string, status: JobStatus) {
    if (!useMemory()) {
      return this.prisma.$transaction([
        this.prisma.job.update({ where: { id }, data: { status } }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Job ${id} -> ${status}` }
        })
      ]);
    }
    seedMemory();
    return this.prisma
      .$transaction([
        this.prisma.job.update({ where: { id }, data: { status } }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Job ${id} -> ${status}` }
        })
      ])
      .catch(() => {
        const job = memoryStore.jobs.find((j) => j.id === id);
        if (job) job.status = status as any;
        return [job, { id: "audit", action: `Job ${id} -> ${status}` }];
      });
  }

  resolveReport(id: string) {
    if (!useMemory()) {
      return this.prisma.$transaction([
        this.prisma.report.delete({ where: { id } }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Report ${id} resolved` }
        })
      ]);
    }
    seedMemory();
    return this.prisma
      .$transaction([
        this.prisma.report.delete({ where: { id } }),
        this.prisma.adminAuditLog.create({
          data: { adminId: "system", action: `Report ${id} resolved` }
        })
      ])
      .catch(() => {
        const idx = memoryStore.reports.findIndex((r) => r.id === id);
        const removed = idx >= 0 ? memoryStore.reports.splice(idx, 1)[0] : null;
        return [removed, { id: "audit", action: `Report ${id} resolved` }];
      });
  }

  createJob(
    adminId: string,
    data: {
      title: string;
      description: string;
      locationType: "ONSITE" | "REMOTE" | "HYBRID";
      location?: string;
      salaryMin?: number;
      salaryMax?: number;
      urgency?: string;
      status?: "DRAFT" | "PUBLISHED" | "CLOSED";
      contactMethods?: ContactMethod[];
      contactEmail?: string;
      contactWebsite?: string;
      contactWhatsapp?: string;
    }
  ) {
    const contactMethods = data.contactMethods?.length ? data.contactMethods : [ContactMethod.PLATFORM];
    return this.prisma.job.create({
      data: {
        ...data,
        contactMethods,
        hirerId: adminId,
        status: data.status ?? "PUBLISHED"
      }
    });
  }

  createService(
    adminId: string,
    data: {
      title: string;
      description: string;
      rate: string;
      contactMethods?: ContactMethod[];
      contactEmail?: string;
      contactWebsite?: string;
      contactWhatsapp?: string;
    }
  ) {
    const contactMethods = data.contactMethods?.length ? data.contactMethods : [ContactMethod.PLATFORM];
    return this.prisma.service.create({
      data: {
        ...data,
        contactMethods,
        envoyId: adminId,
        status: "ACTIVE"
      }
    });
  }

  createGig(
    adminId: string,
    data: {
      title: string;
      description: string;
      amount: string;
      location: string;
      duration: string;
      urgent?: boolean;
      contactMethods?: ContactMethod[];
      contactEmail?: string;
      contactWebsite?: string;
      contactWhatsapp?: string;
    }
  ) {
    const contactMethods = data.contactMethods?.length ? data.contactMethods : [ContactMethod.PLATFORM];
    return this.prisma.gig.create({
      data: {
        ...data,
        contactMethods,
        postedById: adminId,
        status: "AVAILABLE",
        urgent: data.urgent ?? false
      }
    });
  }
}
