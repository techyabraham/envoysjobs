import { Controller, Get, Patch, Param, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  list(@Req() req: any) {
    return this.notificationsService.list(req.user?.id || "");
  }

  @Patch(":id/read")
  read(@Req() req: any, @Param("id") id: string) {
    return this.notificationsService.read(req.user?.id || "", id);
  }
}
