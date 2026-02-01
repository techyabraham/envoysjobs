import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  users() {
    return this.prisma.user.findMany();
  }

  jobs() {
    return this.prisma.job.findMany();
  }

  reports() {
    return this.prisma.report.findMany();
  }

  updateVerification(id: string, status: string) {\n    return this.prisma.$transaction([\n      this.prisma.verification.update({ where: { id }, data: { status } }),\n      this.prisma.adminAuditLog.create({\n        data: { adminId: "system", action: `Verification ${id} -> ${status}` }\n      })\n    ]);\n  }

  updateSteward(userId: string, status: string) {\n    return this.prisma.$transaction([\n      this.prisma.user.update({\n        where: { id: userId },\n        data: { stewardStatus: status }\n      }),\n      this.prisma.adminAuditLog.create({\n        data: { adminId: "system", action: `Steward ${userId} -> ${status}` }\n      })\n    ]);\n  }
}

