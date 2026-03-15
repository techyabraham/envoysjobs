import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { StorageService } from "../../common/storage.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, StorageService]
})
export class UsersModule {}
