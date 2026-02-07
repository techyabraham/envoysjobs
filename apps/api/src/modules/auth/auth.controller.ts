import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { AuthService } from "./auth.service";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(["ENVOY", "HIRER", "ADMIN"])
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
  logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Post("request-otp")
  requestOtp(@Body() body: { phone: string }) {
    return this.authService.requestOtp(body.phone);
  }

  @Post("verify-otp")
  verifyOtp(@Body() body: { phone: string; code: string }) {
    return this.authService.verifyOtp(body.phone, body.code);
  }
}
