import { Module } from "@nestjs/common";
import { MessagingController } from "./messaging.controller";
import { MessagingService } from "./messaging.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { MessagingGateway } from "./messaging.gateway";
import { StorageService } from "../../common/storage.service";
import { JwtModule } from "@nestjs/jwt";

const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-secret");

@Module({
  imports: [NotificationsModule, JwtModule.register({ secret: jwtSecret })],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway, StorageService]
})
export class MessagingModule {}
