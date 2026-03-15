"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./app.module");
describe("App (e2e)", () => {
    let app;
    let httpServer;
    let accessToken = "";
    const email = `envoy-${Date.now()}@envoysjobs.test`;
    const password = "password123";
    beforeAll(async () => {
        process.env.USE_MEMORY = "true";
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule]
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        httpServer = app.getHttpServer();
    });
    it("GET / should return ok", async () => {
        const res = await (0, supertest_1.default)(httpServer).get("/");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
    });
    it("POST /auth/signup should create an envoy account", async () => {
        const res = await (0, supertest_1.default)(httpServer).post("/auth/signup").send({
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
        const res = await (0, supertest_1.default)(httpServer).post("/auth/login").send({
            email,
            password
        });
        expect(res.status).toBe(201);
        expect(typeof res.body.accessToken).toBe("string");
        accessToken = res.body.accessToken;
    });
    it("GET /auto-messages/templates should include honour template", async () => {
        const res = await (0, supertest_1.default)(httpServer)
            .get("/auto-messages/templates")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        const honour = res.body.find((template) => template.key === "honour");
        expect(honour).toBeTruthy();
        expect(honour.quickReplies).toContain("you are amazing");
    });
    it("GET /conversations should require auth", async () => {
        const res = await (0, supertest_1.default)(httpServer).get("/conversations");
        expect(res.status).toBe(401);
    });
    afterAll(async () => {
        await app.close();
    });
});
