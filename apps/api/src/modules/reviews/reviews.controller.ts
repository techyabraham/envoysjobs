import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { ReviewsService } from "./reviews.service";

const reviewSchema = z.object({
  jobId: z.string().min(1),
  revieweeId: z.string().min(1),
  rating: z.number().min(1).max(5),
  text: z.string().optional()
});

@Controller("reviews")
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  create(@Req() req: any, @Body(new ZodValidationPipe(reviewSchema)) body: z.infer<typeof reviewSchema>) {
    return this.reviewsService.create({
      jobId: body.jobId,
      revieweeId: body.revieweeId,
      reviewerId: req.user?.id || "",
      rating: body.rating,
      text: body.text
    });
  }

  @Get()
  list(@Req() req: any, @Query("revieweeId") revieweeId?: string) {
    return this.reviewsService.list(revieweeId || req.user?.id || "");
  }
}
