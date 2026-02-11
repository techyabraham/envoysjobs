import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { Roles } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { JobsService } from "./jobs.service";
import { JobsImportService } from "./jobs.import.service";

const jobCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  urgency: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional()
});

const jobUpdateSchema = jobCreateSchema.partial();

@Controller("jobs")
export class JobsController {
  constructor(private jobsService: JobsService, private jobsImport: JobsImportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body(new ZodValidationPipe(jobCreateSchema)) body: z.infer<typeof jobCreateSchema>) {
    return this.jobsService.create({ ...body, hirerId: req.user?.id || "" });
  }

  @Get()
  list(@Query() query: any) {
    return this.jobsService.list(query);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.jobsService.get(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(jobUpdateSchema)) body: z.infer<typeof jobUpdateSchema>
  ) {
    return this.jobsService.update(id, body);
  }

  @Post(":id/publish")
  @UseGuards(JwtAuthGuard)
  publish(@Param("id") id: string) {
    return this.jobsService.publish(id);
  }

  @Post(":id/close")
  @UseGuards(JwtAuthGuard)
  close(@Param("id") id: string) {
    return this.jobsService.close(id);
  }

  @Get("saved")
  @UseGuards(JwtAuthGuard)
  saved(@Req() req: any) {
    return this.jobsService.listSavedJobs(req.user?.id || "");
  }

  @Post(":id/save")
  @UseGuards(JwtAuthGuard)
  save(@Req() req: any, @Param("id") id: string) {
    return this.jobsService.saveJob(req.user?.id || "", id);
  }

  @Delete(":id/save")
  @UseGuards(JwtAuthGuard)
  unsave(@Req() req: any, @Param("id") id: string) {
    return this.jobsService.unsaveJob(req.user?.id || "", id);
  }

  @Post("import/external")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  importExternal() {
    return this.jobsImport.importExternalJobs();
  }
}
