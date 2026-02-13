import { Body, Controller, Delete, Get, Patch, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ContactMethod, JobStatus, StewardStatus, VerificationStatus } from "@prisma/client";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RolesGuard } from "../../common/roles.guard";
import { Roles } from "../../common/roles.decorator";
import { AdminService } from "./admin.service";

const verificationSchema = z.object({
  status: z.nativeEnum(VerificationStatus)
});

const stewardSchema = z.object({
  status: z.nativeEnum(StewardStatus)
});

const jobStatusSchema = z.object({
  status: z.nativeEnum(JobStatus)
});

const contactMethodEnum = z.nativeEnum(ContactMethod);
const contactInfoSchema = z.object({
  contactMethods: z.array(contactMethodEnum).optional(),
  contactEmail: z.string().email().optional(),
  contactWebsite: z.string().url().optional(),
  contactWhatsapp: z.string().min(8).optional()
});

const adminCreateJobSchema = z
  .object({
    title: z.string().min(2),
    description: z.string().min(2),
    locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
    location: z.string().optional(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    urgency: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional()
  })
  .merge(contactInfoSchema);

const adminCreateServiceSchema = z
  .object({
    title: z.string().min(2),
    description: z.string().min(10),
    rate: z.string().min(2)
  })
  .merge(contactInfoSchema);

const adminCreateGigSchema = z
  .object({
    title: z.string().min(2),
    description: z.string().min(10),
    amount: z.string().min(2),
    location: z.string().min(2),
    duration: z.string().min(1),
    urgent: z.boolean().optional()
  })
  .merge(contactInfoSchema);

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get("users")
  users() {
    return this.adminService.users();
  }

  @Get("jobs")
  jobs() {
    return this.adminService.jobs();
  }

  @Get("reports")
  reports() {
    return this.adminService.reports();
  }

  @Get("verifications")
  verifications() {
    return this.adminService.verifications();
  }

  @Patch("verifications/:id")
  updateVerification(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(verificationSchema))
    body: z.infer<typeof verificationSchema>
  ) {
    return this.adminService.updateVerification(id, body.status);
  }

  @Patch("stewards/:userId")
  updateSteward(
    @Param("userId") userId: string,
    @Body(new ZodValidationPipe(stewardSchema)) body: z.infer<typeof stewardSchema>
  ) {
    return this.adminService.updateSteward(userId, body.status);
  }

  @Patch("jobs/:id/status")
  updateJobStatus(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(jobStatusSchema)) body: z.infer<typeof jobStatusSchema>
  ) {
    return this.adminService.updateJobStatus(id, body.status);
  }

  @Delete("reports/:id")
  resolveReport(@Param("id") id: string) {
    return this.adminService.resolveReport(id);
  }

  @Post("jobs")
  createJob(
    @Req() req: any,
    @Body(new ZodValidationPipe(adminCreateJobSchema)) body: z.infer<typeof adminCreateJobSchema>
  ) {
    return this.adminService.createJob(req.user?.id || "", body);
  }

  @Post("services")
  createService(
    @Req() req: any,
    @Body(new ZodValidationPipe(adminCreateServiceSchema)) body: z.infer<typeof adminCreateServiceSchema>
  ) {
    return this.adminService.createService(req.user?.id || "", body);
  }

  @Post("gigs")
  createGig(
    @Req() req: any,
    @Body(new ZodValidationPipe(adminCreateGigSchema)) body: z.infer<typeof adminCreateGigSchema>
  ) {
    return this.adminService.createGig(req.user?.id || "", body);
  }
}
