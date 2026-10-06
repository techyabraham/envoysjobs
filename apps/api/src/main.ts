import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "dev-secret") {
      throw new Error("JWT_SECRET must be set to a unique production secret");
    }
    if (process.env.MAIL_PROVIDER !== "resend" || !process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
      throw new Error("Production email requires MAIL_PROVIDER=resend, RESEND_API_KEY, and verified MAIL_FROM");
    }
    if (
      process.env.SMS_PROVIDER !== "twilio" ||
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_FROM_NUMBER
    ) {
      throw new Error("Production OTP delivery requires configured Twilio credentials");
    }
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowedOrigin = process.env.CORS_ORIGIN || (process.env.NODE_ENV === "production" ? "" : "*");
  if (process.env.NODE_ENV === "production" && !allowedOrigin) {
    throw new Error("CORS_ORIGIN must be configured in production");
  }
  app.enableCors({
    origin: allowedOrigin === "*" ? true : allowedOrigin,
    credentials: true
  });
  app.useStaticAssets(join(process.cwd(), "apps/api/uploads"), {
    prefix: "/uploads"
  });

  const config = new DocumentBuilder()
    .setTitle("EnvoysJobs API")
    .setDescription("EnvoysJobs REST API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
