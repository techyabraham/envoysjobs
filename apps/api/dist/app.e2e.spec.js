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
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule]
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });
    it("GET / should return ok", async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer()).get("/");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
    });
    afterAll(async () => {
        await app.close();
    });
});
