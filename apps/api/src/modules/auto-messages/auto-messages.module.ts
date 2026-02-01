import { Module } from "@nestjs/common";
import { AutoMessagesController } from "./auto-messages.controller";
import { AutoMessagesService } from "./auto-messages.service";

@Module({
  controllers: [AutoMessagesController],
  providers: [AutoMessagesService]
})
export class AutoMessagesModule {}
