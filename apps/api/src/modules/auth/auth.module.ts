import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { MailerService } from "../../common/mailer.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "dev-secret",
      signOptions: { expiresIn: "15m" }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailerService],
  exports: [AuthService]
})
export class AuthModule {}
