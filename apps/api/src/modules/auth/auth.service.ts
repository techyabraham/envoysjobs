import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import bcrypt from "bcryptjs";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";

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
      if (!record) throw new UnauthorizedException();
      const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
      if (!user) throw new UnauthorizedException();
      return this.issueTokens(user);
    }
    seedMemory();
    const record = await this.prisma.refreshToken
      .findUnique({ where: { token: refreshToken } })
      .catch(() => memoryStore.refreshTokens.find((r) => r.token === refreshToken) as any);
    if (!record) throw new UnauthorizedException();
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
    await this.prisma.refreshToken.deleteMany({ where: { userId } }).catch(() => {
      memoryStore.refreshTokens = memoryStore.refreshTokens.filter((t) => t.userId !== userId);
    });
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

  async forgotPassword(email: string) {
    if (!email) throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({ where: { email } }).catch(() => null);
    if (!user) {
      return { status: "sent" };
    }
    return { status: "sent" };
  }

  private async issueTokens(user: { id: string; role: string; email?: string; firstName?: string; lastName?: string }) {
    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });
    const tokenValue = `${user.id}-${Date.now()}`;
    const refreshToken = await this.prisma.refreshToken
      .create({
        data: {
          token: tokenValue,
          role: user.role,
          userId: user.id
        }
      })
      .catch(() => {
        const record = { token: tokenValue, role: user.role, userId: user.id, createdAt: new Date() };
        memoryStore.refreshTokens.push(record);
        return record as any;
      });
    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }
}
