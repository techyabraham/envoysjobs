"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useStaticAssets((0, path_1.join)(process.cwd(), "apps/api/uploads"), {
        prefix: "/uploads"
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("EnvoysJobs API")
        .setDescription("EnvoysJobs REST API")
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("docs", app, document);
    await app.listen(process.env.PORT || 4000);
}
bootstrap();
