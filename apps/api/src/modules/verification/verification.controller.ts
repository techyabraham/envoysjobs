import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { VerificationService } from "./verification.service";

@Controller("verification")
@UseGuards(JwtAuthGuard)
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowed.includes(file.mimetype)) {
          return cb(new Error("Invalid file type"), false);
        }
        cb(null, true);
      }
    })
  )
  upload(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.verificationService.upload(req.user?.id || "", file);
  }

  @Get("status")
  status(@Req() req: any) {
    return this.verificationService.status(req.user?.id || "");
  }
}
