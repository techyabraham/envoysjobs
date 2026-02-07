import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(data: { jobId: string; reviewerId: string; revieweeId: string; rating: number; text?: string }) {
    if (!useMemory()) {
      return this.prisma.review.create({ data });
    }
    seedMemory();
    return this.prisma.review.create({ data }).catch(() => {
      const review = {
        id: createId(),
        ...data,
        createdAt: new Date()
      } as any;
      memoryStore.reviews.push(review);
      return review;
    });
  }

  list(revieweeId: string) {
    if (!useMemory()) {
      return this.prisma.review.findMany({ where: { revieweeId } });
    }
    seedMemory();
    return this.prisma.review.findMany({ where: { revieweeId } }).catch(() => {
      return (memoryStore.reviews as any[]).filter((r) => r.revieweeId === revieweeId);
    });
  }
}
