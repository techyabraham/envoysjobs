import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";
import { StorageService } from "../../common/storage.service";

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController],
  providers: [ServicesService, StorageService]
})
export class ServicesModule {}
