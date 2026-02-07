import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { ReportsService } from "./reports.service";

const reportSchema = z.object({
  reason: z.string().min(3)
});

@Controller("reports")
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  create(@Req() req: any, @Body(new ZodValidationPipe(reportSchema)) body: z.infer<typeof reportSchema>) {
    return this.reportsService.create(req.user?.id || "", body.reason);
  }
}
