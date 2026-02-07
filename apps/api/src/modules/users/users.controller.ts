import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  getMe(@Req() req: any) {
    return this.usersService.getUser(req.user?.id || "");
  }

  @Put("me")
  updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateUser(req.user?.id || "", body);
  }

  @Get("envoy/profile")
  getEnvoy(@Req() req: any, @Query("userId") userId?: string) {
    return this.usersService.getEnvoyProfile(userId || req.user?.id || "");
  }

  @Put("envoy/profile")
  updateEnvoy(@Req() req: any, @Body() body: any) {
    return this.usersService.updateEnvoyProfile(req.user?.id || "", body);
  }

  @Get("hirer/profile")
  getHirer(@Req() req: any) {
    return this.usersService.getHirerProfile(req.user?.id || "");
  }

  @Put("hirer/profile")
  updateHirer(@Req() req: any, @Body() body: any) {
    return this.usersService.updateHirerProfile(req.user?.id || "", body);
  }
}
