import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { ApplicationsService } from "./applications.service";

const statusSchema = z.object({
  status: z.enum(["APPLIED", "IN_REVIEW", "INTERVIEW", "OFFER", "HIRED", "REJECTED"])
});

@Controller()
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post("jobs/:id/apply")
  apply(@Param("id") jobId: string, @Req() req: any) {
    return this.applicationsService.apply(jobId, req.user?.id || "");
  }

  @Get("applications")
  list(@Req() req: any) {
    return this.applicationsService.list(req.user?.id || "");
  }

  @Patch("applications/:id/status")
  updateStatus(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(statusSchema)) body: z.infer<typeof statusSchema>
  ) {
    return this.applicationsService.updateStatus(id, body.status);
  }
}
