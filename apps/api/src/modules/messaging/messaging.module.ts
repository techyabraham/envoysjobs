import { Module } from "@nestjs/common";
import { MessagingController } from "./messaging.controller";
import { MessagingService } from "./messaging.service";
import { NotificationsService } from "../notifications/notifications.service";
import { MessagingGateway } from "./messaging.gateway";

@Module({
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway, NotificationsService]
})
export class MessagingModule {}
