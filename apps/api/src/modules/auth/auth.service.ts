import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "ENVOY" | "HIRER" | "ADMIN";
  }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashed,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      }
    });
    return this.issueTokens(user.id, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException();
    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) throw new UnauthorizedException();
    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    const record = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!record) throw new UnauthorizedException();
    return this.issueTokens(record.userId, record.role);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { success: true };
  }

  async requestOtp(phone: string) {
    await this.prisma.verification.upsert({
      where: { phone },
      update: { otpCode: "123456" },
      create: { phone, otpCode: "123456", status: "PENDING" }
    });
    return { status: "sent" };
  }

  async verifyOtp(phone: string, code: string) {
    const record = await this.prisma.verification.findUnique({ where: { phone } });
    if (!record || record.otpCode !== code) throw new UnauthorizedException();
    await this.prisma.verification.update({ where: { phone }, data: { status: "VERIFIED" } });
    return { status: "verified" };
  }

  private async issueTokens(userId: string, role: string) {
    const accessToken = this.jwt.sign({ sub: userId, role });
    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        token: `${userId}-${Date.now()}`,
        role,
        userId
      }
    });
    return { accessToken, refreshToken: refreshToken.token };
  }
}
