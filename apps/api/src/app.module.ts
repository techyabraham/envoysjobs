import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./modules/app/app.controller";
import { AppService } from "./modules/app/app.service";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { ApplicationsModule } from "./modules/applications/applications.module";
import { MessagingModule } from "./modules/messaging/messaging.module";
import { AutoMessagesModule } from "./modules/auto-messages/auto-messages.module";
import { AdminModule } from "./modules/admin/admin.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { VerificationModule } from "./modules/verification/verification.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { ServicesModule } from "./modules/services/services.module";
import { GigsModule } from "./modules/gigs/gigs.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env", "apps/api/.env.local", "apps/api/.env"]
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 20 }]
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    MessagingModule,
    AutoMessagesModule,
    AdminModule,
    NotificationsModule,
    VerificationModule,
    ReviewsModule,
    ReportsModule,
    ServicesModule,
    GigsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
