import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AutoMessagesService } from "./auto-messages.service";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RolesGuard } from "../../common/roles.guard";
import { Roles } from "../../common/roles.decorator";

@Controller("auto-messages")
export class AutoMessagesController {
  constructor(private autoMessagesService: AutoMessagesService) {}

  @Get("templates")
  list() {
    return this.autoMessagesService.list();
  }

  @Post("seed")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  seed() {
    return this.autoMessagesService.seed();
  }
}
