import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

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
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtMock },
        { provide: PrismaService, useValue: prismaMock }
      ]
    }).compile();

    const service = moduleRef.get(AuthService);
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
