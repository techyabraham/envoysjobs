import { Controller, Get, Post } from "@nestjs/common";
import { AutoMessagesService } from "./auto-messages.service";

@Controller("auto-messages")
export class AutoMessagesController {
  constructor(private autoMessagesService: AutoMessagesService) {}

  @Get("templates")
  list() {
    return this.autoMessagesService.list();
  }

  @Post("seed")
  seed() {
    return this.autoMessagesService.seed();
  }
}
