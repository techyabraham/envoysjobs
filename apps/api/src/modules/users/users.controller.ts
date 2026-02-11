import { Body, Controller, Get, Put, Post, Query, Req, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  getMe(@Req() req: any) {
    return this.usersService.getUser(req.user?.id || "");
  }

  @Put("me")
  updateMe(@Req() req: any, @Body() body: any) {
    return this.usersService.updateUser(req.user?.id || "", body);
  }

  @Post("me/avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png"];
        if (!allowed.includes(file.mimetype)) {
          return cb(new Error("Invalid file type"), false);
        }
        cb(null, true);
      }
    })
  )
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadAvatar(req.user?.id || "", file);
  }

  @Get("envoy/profile")
  getEnvoy(@Req() req: any, @Query("userId") userId?: string) {
    return this.usersService.getEnvoyProfile(userId || req.user?.id || "");
  }

  @Put("envoy/profile")
  updateEnvoy(@Req() req: any, @Body() body: any) {
    return this.usersService.updateEnvoyProfile(req.user?.id || "", body);
  }

  @Get("hirer/profile")
  getHirer(@Req() req: any) {
    return this.usersService.getHirerProfile(req.user?.id || "");
  }

  @Put("hirer/profile")
  updateHirer(@Req() req: any, @Body() body: any) {
    return this.usersService.updateHirerProfile(req.user?.id || "", body);
  }
}
