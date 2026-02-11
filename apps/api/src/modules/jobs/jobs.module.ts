import { Module } from "@nestjs/common";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";
import { JobsImportService } from "./jobs.import.service";

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobsImportService]
})
export class JobsModule {}
