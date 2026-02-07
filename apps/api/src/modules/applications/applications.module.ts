import { Module } from "@nestjs/common";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";
import { NotificationsService } from "../notifications/notifications.service";

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, NotificationsService]
})
export class ApplicationsModule {}
