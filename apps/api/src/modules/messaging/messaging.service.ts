import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { sanitizeMessage } from "@envoysjobs/utils";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService, private notifications: NotificationsService) {}

  listConversations(userId: string) {
    if (!useMemory()) {
      return this.prisma.conversation.findMany({
        where: {
          participants: { some: { userId } }
        },
        include: { job: true, messages: { take: 1, orderBy: { createdAt: "desc" } } }
      });
    }
    seedMemory();
    return this.prisma.conversation
      .findMany({
        where: {
          participants: { some: { userId } }
        },
        include: { job: true, messages: { take: 1, orderBy: { createdAt: "desc" } } }
      })
      .catch(() => {
        return memoryStore.conversations
          .filter((conv) => conv.participants.includes(userId))
          .map((conv) => {
            const job = memoryStore.jobs.find((j) => j.id === conv.jobId);
            const messages = memoryStore.messages
              .filter((m) => m.conversationId === conv.id)
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .slice(0, 1);
            return { ...conv, job, messages };
          });
      });
  }

  async getOrCreateConversation(data: { jobId: string; envoyId: string; hirerId: string }) {
    if (!useMemory()) {
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
    seedMemory();
    const existing = await this.prisma.conversation
      .findFirst({
        where: { jobId: data.jobId, participants: { every: { userId: { in: [data.envoyId, data.hirerId] } } } }
      })
      .catch(() => {
        return memoryStore.conversations.find(
          (conv) =>
            conv.jobId === data.jobId &&
            conv.participants.includes(data.envoyId) &&
            conv.participants.includes(data.hirerId)
        ) as any;
      });
    if (existing) return existing;
    return this.prisma.conversation
      .create({
        data: {
          jobId: data.jobId,
          participants: {
            create: [{ userId: data.envoyId }, { userId: data.hirerId }]
          }
        }
      })
      .catch(() => {
        const conversation = {
          id: createId(),
          jobId: data.jobId,
          participants: [data.envoyId, data.hirerId],
          createdAt: new Date()
        };
        memoryStore.conversations.push(conversation);
        return conversation as any;
      });
  }

  listMessages(conversationId: string) {
    if (!useMemory()) {
      return this.prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } });
    }
    seedMemory();
    return this.prisma.message
      .findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } })
      .catch(() => {
        return memoryStore.messages
          .filter((m) => m.conversationId === conversationId)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      });
  }

  sendMessage(conversationId: string, senderId: string, text: string) {
    if (!useMemory()) {
      return this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          text: sanitizeMessage(text)
        }
      }).then(async (message) => {
        const convo = await this.prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { participants: true }
        });
        if (convo) {
          const recipients = convo.participants.filter((p) => p.userId !== senderId);
          await Promise.all(
            recipients.map((p) =>
              this.notifications.create(p.userId, "New message", "You received a new message.")
            )
          );
        }
        return message;
      });
    }
    seedMemory();
    return this.prisma.message
      .create({
        data: {
          conversationId,
          senderId,
          text: sanitizeMessage(text)
        }
      })
      .catch(() => {
        const message = {
          id: createId(),
          conversationId,
          senderId,
          text: sanitizeMessage(text),
          createdAt: new Date()
        };
        memoryStore.messages.push(message);
        const convo = memoryStore.conversations.find((c) => c.id === conversationId);
        if (convo) {
          convo.participants
            .filter((id) => id !== senderId)
            .forEach((id) => this.notifications.create(id, "New message", "You received a new message."));
        }
        return message as any;
      });
  }
}
