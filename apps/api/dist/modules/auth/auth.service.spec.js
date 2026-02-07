"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const prismaMock = {
    user: {
        create: jest.fn()
    },
    refreshToken: {
        create: jest.fn()
    }
};
const jwtMock = {
    sign: jest.fn(() => "access-token")
};
describe("AuthService", () => {
    it("issues tokens on signup", async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: jwt_1.JwtService, useValue: jwtMock },
                { provide: prisma_service_1.PrismaService, useValue: prismaMock }
            ]
        }).compile();
        const service = moduleRef.get(auth_service_1.AuthService);
        prismaMock.user.create.mockResolvedValue({ id: "user-1", role: "ENVOY" });
        prismaMock.refreshToken.create.mockResolvedValue({ token: "refresh" });
        const result = await service.signup({
            email: "a@b.com",
            password: "password123",
            firstName: "A",
            lastName: "B",
            role: "ENVOY"
        });
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
    });
});
