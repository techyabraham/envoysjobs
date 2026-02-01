import { Controller, Get, Patch, Param } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  list() {
    return this.notificationsService.list();
  }

  @Patch(":id/read")
  read(@Param("id") id: string) {
    return this.notificationsService.read(id);
  }
}
