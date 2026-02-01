import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { sanitizeMessage } from "@envoysjobs/utils";

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  listConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId } }
      },
      include: { job: true, messages: { take: 1, orderBy: { createdAt: "desc" } } }
    });
  }

  async getOrCreateConversation(data: { jobId: string; envoyId: string; hirerId: string }) {
    const existing = await this.prisma.conversation.findFirst({
      where: { jobId: data.jobId, participants: { every: { userId: { in: [data.envoyId, data.hirerId] } } } }
    });
    if (existing) return existing;
    return this.prisma.conversation.create({
      data: {
        jobId: data.jobId,
        participants: {
          create: [{ userId: data.envoyId }, { userId: data.hirerId }]
        }
      }
    });
  }

  listMessages(conversationId: string) {
    return this.prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } });
  }

  sendMessage(conversationId: string, senderId: string, text: string) {
    return this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        text: sanitizeMessage(text)
      }
    });
  }
}
