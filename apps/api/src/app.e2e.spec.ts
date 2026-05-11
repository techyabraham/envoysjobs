import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./app.module";

describe("App (e2e)", () => {
  let app: INestApplication;
  let httpServer: any;
  let accessToken = "";
  const email = `envoy-${Date.now()}@envoysjobs.test`;
  const password = "password123";

  beforeAll(async () => {
    process.env.USE_MEMORY = "true";
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  it("GET / should return ok", async () => {
    const res = await request(httpServer).get("/");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("POST /auth/signup should create an envoy account", async () => {
    const res = await request(httpServer).post("/auth/signup").send({
      email,
      password,
      firstName: "Envoy",
      lastName: "Tester",
      role: "ENVOY"
    });
    expect(res.status).toBe(201);
    expect(res.body.user?.email).toBe(email);
  });

  it("POST /auth/login should return access token", async () => {
    const res = await request(httpServer).post("/auth/login").send({
      email,
      password
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.accessToken).toBe("string");
    accessToken = res.body.accessToken;
  });

  it("GET /auto-messages/templates should include honour template", async () => {
    const res = await request(httpServer)
      .get("/auto-messages/templates")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    const honour = (res.body as any[]).find((template) => template.key === "honour");
    expect(honour).toBeTruthy();
    expect(honour.quickReplies).toContain("you are amazing");
  });

  it("GET /conversations should require auth", async () => {
    const res = await request(httpServer).get("/conversations");
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
