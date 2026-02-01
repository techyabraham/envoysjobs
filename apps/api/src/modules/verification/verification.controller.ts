import { Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { VerificationService } from "./verification.service";

@Controller("verification")
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", {\n    limits: { fileSize: 5 * 1024 * 1024 },\n    fileFilter: (req, file, cb) => {\n      const allowed = ["image/jpeg", "image/png", "application/pdf"];\n      if (!allowed.includes(file.mimetype)) {\n        return cb(new Error("Invalid file type"), false);\n      }\n      cb(null, true);\n    }\n  }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.verificationService.upload(file);
  }

  @Get("status")
  status() {
    return this.verificationService.status();
  }
}

