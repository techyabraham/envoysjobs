import { Module } from "@nestjs/common";
import { MessagingController } from "./messaging.controller";
import { MessagingService } from "./messaging.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { MessagingGateway } from "./messaging.gateway";
import { StorageService } from "../../common/storage.service";

@Module({
  imports: [NotificationsModule],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway, StorageService]
})
export class MessagingModule {}
