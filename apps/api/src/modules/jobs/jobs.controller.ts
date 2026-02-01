import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JobsService } from "./jobs.service";

const jobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  urgency: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
  hirerId: z.string()
});

@Controller("jobs")
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(jobSchema)) body: z.infer<typeof jobSchema>) {
    return this.jobsService.create(body);
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
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(jobSchema.partial())) body: z.infer<typeof jobSchema.partial()>
  ) {
    return this.jobsService.update(id, body);
  }

  @Post(":id/publish")
  publish(@Param("id") id: string) {
    return this.jobsService.publish(id);
  }

  @Post(":id/close")
  close(@Param("id") id: string) {
    return this.jobsService.close(id);
  }
}
