import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
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
}
