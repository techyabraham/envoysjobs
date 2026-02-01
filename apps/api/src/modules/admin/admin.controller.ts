import { Body, Controller, Get, Patch, Param, UseGuards } from "@nestjs/common";\nimport { JwtAuthGuard } from "../../common/jwt-auth.guard";\nimport { RolesGuard } from "../../common/roles.guard";\nimport { Roles } from "../../common/roles.decorator";
import { AdminService } from "./admin.service";

@Controller("admin")\n@UseGuards(JwtAuthGuard, RolesGuard)\n@Roles("ADMIN")
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

  @Patch("verifications/:id")
  updateVerification(@Param("id") id: string, @Body() body: { status: string }) {
    return this.adminService.updateVerification(id, body.status);
  }

  @Patch("stewards/:userId")
  updateSteward(@Param("userId") userId: string, @Body() body: { status: string }) {
    return this.adminService.updateSteward(userId, body.status);
  }
}

