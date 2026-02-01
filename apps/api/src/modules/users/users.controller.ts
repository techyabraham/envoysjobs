import { Body, Controller, Get, Put, Req } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller()
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
  getEnvoy(@Req() req: any) {
    return this.usersService.getEnvoyProfile(req.user?.id || "");
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
