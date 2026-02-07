import { Body, Controller, Get, Patch, Param, UseGuards } from "@nestjs/common";
import { StewardStatus, VerificationStatus } from "@prisma/client";
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
}
