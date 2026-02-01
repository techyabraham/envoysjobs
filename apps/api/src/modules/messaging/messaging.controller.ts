import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { MessagingService } from "./messaging.service";

const conversationSchema = z.object({
  jobId: z.string(),
  envoyId: z.string(),
  hirerId: z.string()
});

const messageSchema = z.object({
  senderId: z.string(),
  text: z.string().min(1)
});

@Controller()
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Get("conversations")
  listConversations(@Query("userId") userId: string) {
    return this.messagingService.listConversations(userId);
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
    @Body(new ZodValidationPipe(messageSchema)) body: z.infer<typeof messageSchema>
  ) {
    return this.messagingService.sendMessage(id, body.senderId, body.text);
  }
}
