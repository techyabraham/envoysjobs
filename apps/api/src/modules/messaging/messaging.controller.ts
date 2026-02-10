import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Throttle } from "@nestjs/throttler";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { MessagingService } from "./messaging.service";

const conversationSchema = z.object({
  jobId: z.string(),
  envoyId: z.string(),
  hirerId: z.string()
});

const messageSchema = z.object({
  text: z.string().min(1)
});

const attachmentSchema = z.object({
  text: z.string().optional()
});

@Controller()
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Get("conversations")
  listConversations(@Req() req: any, @Query("userId") userId?: string) {
    return this.messagingService.listConversations(userId || req.user?.id || "");
  }

  @Post("conversations")
  getOrCreate(@Body(new ZodValidationPipe(conversationSchema)) body: z.infer<typeof conversationSchema>) {
    return this.messagingService.getOrCreateConversation(body);
  }

  @Get("conversations/:id/messages")
  listMessages(@Param("id") id: string) {
    return this.messagingService.listMessages(id);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post("conversations/:id/messages")
  sendMessage(
    @Param("id") id: string,
    @Req() req: any,
    @Body(new ZodValidationPipe(messageSchema)) body: z.infer<typeof messageSchema>
  ) {
    return this.messagingService.sendMessage(id, req.user?.id || "", body.text);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("conversations/:id/attachments")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowed.includes(file.mimetype)) {
          return cb(new Error("Invalid file type"), false);
        }
        cb(null, true);
      }
    })
  )
  sendAttachment(
    @Param("id") id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(attachmentSchema)) body: z.infer<typeof attachmentSchema>
  ) {
    return this.messagingService.sendAttachment(id, req.user?.id || "", file, body.text);
  }
}
