import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { GigsController } from "./gigs.controller";
import { GigsService } from "./gigs.service";

@Module({
  imports: [PrismaModule],
  controllers: [GigsController],
  providers: [GigsService]
})
export class GigsModule {}
