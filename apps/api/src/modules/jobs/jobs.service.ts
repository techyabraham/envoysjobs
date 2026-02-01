import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.job.create({ data });
  }

  list(query: any) {
    return this.prisma.job.findMany({ where: query });
  }

  get(id: string) {
    return this.prisma.job.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.job.update({ where: { id }, data });
  }

  publish(id: string) {
    return this.prisma.job.update({ where: { id }, data: { status: "PUBLISHED" } });
  }

  close(id: string) {
    return this.prisma.job.update({ where: { id }, data: { status: "CLOSED" } });
  }
}
