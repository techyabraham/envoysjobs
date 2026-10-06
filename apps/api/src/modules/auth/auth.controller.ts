import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(["ENVOY", "HIRER"])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("signup")
  signup(@Body(new ZodValidationPipe(signupSchema)) body: z.infer<typeof signupSchema>) {
    return this.authService.signup(body);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login")
  login(@Body(new ZodValidationPipe(loginSchema)) body: z.infer<typeof loginSchema>) {
    return this.authService.login(body.email, body.password);
  }

  @Post("refresh")
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("request-otp")
  requestOtp(@Body(new ZodValidationPipe(z.object({ phone: z.string().trim().min(8).max(32) }))) body: { phone: string }) {
    return this.authService.requestOtp(body.phone);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("verify-otp")
  verifyOtp(@Body(new ZodValidationPipe(z.object({ phone: z.string().trim().min(8).max(32), code: z.string().length(6) }))) body: { phone: string; code: string }) {
    return this.authService.verifyOtp(body.phone, body.code);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post("forgot-password")
  forgotPassword(@Body(new ZodValidationPipe(z.object({ email: z.string().email() }))) body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("reset-password")
  resetPassword(@Body(new ZodValidationPipe(z.object({ token: z.string().min(32), password: z.string().min(8) }))) body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }
}
