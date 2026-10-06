import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import bcrypt from "bcryptjs";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";
import { MailerService } from "../../common/mailer.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private mailer: MailerService) {}

  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "ENVOY" | "HIRER";
  }) {
    if (!useMemory()) {
      const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existing) {
        throw new ConflictException("Email already in use");
      }
      const hashed = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          passwordHash: hashed,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          stewardStatus: null
        }
      });
      return this.issueTokens(user);
    }
    seedMemory();
    const existingMemory = memoryStore.users.find((u) => u.email === data.email);
    if (existingMemory) {
      throw new ConflictException("Email already in use");
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user
      .create({
        data: {
          email: data.email,
          passwordHash: hashed,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          stewardStatus: null
        }
      })
      .catch(() => {
        const existing = memoryStore.users.find((u) => u.email === data.email);
        if (existing) return existing as any;
        const newUser = {
          id: createId(),
          email: data.email,
          passwordHash: hashed,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          stewardStatus: null
        };
        memoryStore.users.push(newUser);
        return newUser as any;
      });
    return this.issueTokens(user);
  }

  async login(email: string, password: string) {
    if (!useMemory()) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new UnauthorizedException();
      const matches = await bcrypt.compare(password, user.passwordHash);
      if (!matches) throw new UnauthorizedException();
      return this.issueTokens(user);
    }
    seedMemory();
    const user = await this.prisma.user
      .findUnique({ where: { email } })
      .catch(() => memoryStore.users.find((u) => u.email === email) as any);
    if (!user) throw new UnauthorizedException();
    const matches =
      user.passwordHash === "" ? true : await bcrypt.compare(password, user.passwordHash);
    if (!matches) throw new UnauthorizedException();
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    if (!useMemory()) {
      const record = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!record || record.expiresAt <= new Date()) {
        if (record) await this.prisma.refreshToken.delete({ where: { id: record.id } });
        throw new UnauthorizedException();
      }
      const revoked = await this.prisma.refreshToken.deleteMany({ where: { id: record.id } });
      if (revoked.count !== 1) throw new UnauthorizedException();
      const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
      if (!user) throw new UnauthorizedException();
      return this.issueTokens(user);
    }
    seedMemory();
    const record = memoryStore.refreshTokens.find((r) => r.token === refreshToken);
    if (!record) throw new UnauthorizedException();
    memoryStore.refreshTokens = memoryStore.refreshTokens.filter((r) => r.token !== refreshToken);
    const user = memoryStore.users.find((u) => u.id === record.userId);
    if (!user) throw new UnauthorizedException();
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    if (!useMemory()) {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
      return { success: true };
    }
    seedMemory();
    memoryStore.refreshTokens = memoryStore.refreshTokens.filter((t) => t.userId !== userId);
    return { success: true };
  }

  async requestOtp(phone: string) {
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.verification.upsert({
      where: { phone },
      update: { otpCode: this.hashToken(code), otpExpiresAt, otpAttempts: 0, status: "PENDING" },
      create: { phone, otpCode: this.hashToken(code), otpExpiresAt, otpAttempts: 0, status: "PENDING" }
    });
    await this.mailer.sendSmsRequired({
      to: phone,
      text: `Your EnvoysJobs verification code is ${code}. It expires in 10 minutes.`
    });
    return { status: "sent" };
  }

  async verifyOtp(phone: string, code: string) {
    const record = await this.prisma.verification.findUnique({ where: { phone } });
    if (!record?.otpCode || !record.otpExpiresAt || record.otpExpiresAt <= new Date() || record.otpAttempts >= 5) {
      throw new UnauthorizedException();
    }
    if (!this.matchesHash(code, record.otpCode)) {
      await this.prisma.verification.update({ where: { phone }, data: { otpAttempts: { increment: 1 } } });
      throw new UnauthorizedException();
    }
    await this.prisma.verification.update({
      where: { phone },
      data: { status: "VERIFIED", otpCode: null, otpExpiresAt: null, otpAttempts: 0 }
    });
    return { status: "verified" };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { status: "sent" };

    const token = randomBytes(32).toString("base64url");
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(token),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        }
      })
    ]);
    const siteUrl = (process.env.WEB_URL || process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
    const resetUrl = `${siteUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
    try {
      await this.mailer.sendRequired({
        to: user.email,
        subject: "Reset your EnvoysJobs password",
        text: `Use this link to reset your password within one hour: ${resetUrl}`,
        html: `<p>Use the link below to reset your EnvoysJobs password. It expires in one hour.</p><p><a href="${resetUrl}">Reset password</a></p>`
      });
    } catch (error) {
      console.error("[Auth] Password reset email could not be delivered", error);
    }
    return { status: "sent" };
  }

  async resetPassword(token: string, password: string) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: this.hashToken(token) }
    });
    if (!record || record.expiresAt <= new Date()) throw new UnauthorizedException("Reset link is invalid or expired");

    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.$transaction(async (transaction) => {
      const consumed = await transaction.passwordResetToken.deleteMany({
        where: { id: record.id, expiresAt: { gt: new Date() } }
      });
      if (consumed.count !== 1) throw new UnauthorizedException("Reset link is invalid or expired");
      await transaction.user.update({ where: { id: record.userId }, data: { passwordHash } });
      await transaction.refreshToken.deleteMany({ where: { userId: record.userId } });
      await transaction.passwordResetToken.deleteMany({ where: { userId: record.userId } });
    });
    return { status: "updated" };
  }

  private hashToken(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }

  private matchesHash(value: string, expectedHash: string) {
    const actual = Buffer.from(this.hashToken(value), "hex");
    const expected = Buffer.from(expectedHash, "hex");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }

  private async issueTokens(user: { id: string; role: string; email?: string; firstName?: string; lastName?: string; imageUrl?: string | null }) {
    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });
    const tokenValue = randomBytes(48).toString("base64url");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const refreshToken = useMemory()
      ? { token: tokenValue }
      : await this.prisma.refreshToken.create({
          data: { token: tokenValue, role: user.role, userId: user.id, expiresAt }
        });
    if (useMemory()) {
      memoryStore.refreshTokens.push({ token: tokenValue, role: user.role, userId: user.id, createdAt: new Date() });
    }
    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        imageUrl: (user as any).imageUrl ?? null
      }
    };
  }
}
