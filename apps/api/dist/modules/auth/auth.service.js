"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const memory_store_1 = require("../../common/memory.store");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async signup(data) {
        if (!(0, memory_store_1.useMemory)()) {
            const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (existing) {
                throw new common_1.ConflictException("Email already in use");
            }
            const hashed = await bcryptjs_1.default.hash(data.password, 10);
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
        (0, memory_store_1.seedMemory)();
        const existingMemory = memory_store_1.memoryStore.users.find((u) => u.email === data.email);
        if (existingMemory) {
            throw new common_1.ConflictException("Email already in use");
        }
        const hashed = await bcryptjs_1.default.hash(data.password, 10);
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
            const existing = memory_store_1.memoryStore.users.find((u) => u.email === data.email);
            if (existing)
                return existing;
            const newUser = {
                id: (0, memory_store_1.createId)(),
                email: data.email,
                passwordHash: hashed,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                stewardStatus: null
            };
            memory_store_1.memoryStore.users.push(newUser);
            return newUser;
        });
        return this.issueTokens(user);
    }
    async login(email, password) {
        if (!(0, memory_store_1.useMemory)()) {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new common_1.UnauthorizedException();
            const matches = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!matches)
                throw new common_1.UnauthorizedException();
            return this.issueTokens(user);
        }
        (0, memory_store_1.seedMemory)();
        const user = await this.prisma.user
            .findUnique({ where: { email } })
            .catch(() => memory_store_1.memoryStore.users.find((u) => u.email === email));
        if (!user)
            throw new common_1.UnauthorizedException();
        const matches = user.passwordHash === "" ? true : await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!matches)
            throw new common_1.UnauthorizedException();
        return this.issueTokens(user);
    }
    async refresh(refreshToken) {
        if (!(0, memory_store_1.useMemory)()) {
            const record = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
            if (!record)
                throw new common_1.UnauthorizedException();
            const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
            if (!user)
                throw new common_1.UnauthorizedException();
            return this.issueTokens(user);
        }
        (0, memory_store_1.seedMemory)();
        const record = await this.prisma.refreshToken
            .findUnique({ where: { token: refreshToken } })
            .catch(() => memory_store_1.memoryStore.refreshTokens.find((r) => r.token === refreshToken));
        if (!record)
            throw new common_1.UnauthorizedException();
        const user = memory_store_1.memoryStore.users.find((u) => u.id === record.userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        return this.issueTokens(user);
    }
    async logout(userId) {
        if (!(0, memory_store_1.useMemory)()) {
            await this.prisma.refreshToken.deleteMany({ where: { userId } });
            return { success: true };
        }
        (0, memory_store_1.seedMemory)();
        await this.prisma.refreshToken.deleteMany({ where: { userId } }).catch(() => {
            memory_store_1.memoryStore.refreshTokens = memory_store_1.memoryStore.refreshTokens.filter((t) => t.userId !== userId);
        });
        return { success: true };
    }
    async requestOtp(phone) {
        await this.prisma.verification.upsert({
            where: { phone },
            update: { otpCode: "123456" },
            create: { phone, otpCode: "123456", status: "PENDING" }
        });
        return { status: "sent" };
    }
    async verifyOtp(phone, code) {
        const record = await this.prisma.verification.findUnique({ where: { phone } });
        if (!record || record.otpCode !== code)
            throw new common_1.UnauthorizedException();
        await this.prisma.verification.update({ where: { phone }, data: { status: "VERIFIED" } });
        return { status: "verified" };
    }
    async forgotPassword(email) {
        if (!email)
            throw new common_1.UnauthorizedException();
        const user = await this.prisma.user.findUnique({ where: { email } }).catch(() => null);
        if (!user) {
            return { status: "sent" };
        }
        return { status: "sent" };
    }
    async issueTokens(user) {
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
            memory_store_1.memoryStore.refreshTokens.push(record);
            return record;
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
