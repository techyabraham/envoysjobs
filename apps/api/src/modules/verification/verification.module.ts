import { Module } from "@nestjs/common";
import { VerificationController } from "./verification.controller";
import { VerificationService } from "./verification.service";
import { StorageService } from "../../common/storage.service";

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, StorageService]
})
export class VerificationModule {}
