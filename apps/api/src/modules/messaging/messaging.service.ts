import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { sanitizeMessage } from "@envoysjobs/utils";
import { createId, memoryStore, seedMemory, useMemory } from "../../common/memory.store";
import { MessagingGateway } from "./messaging.gateway";
import { StorageService } from "../../common/storage.service";

@Injectable()
export class MessagingService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private gateway: MessagingGateway,
    private storage: StorageService
  ) {}

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

  listMessages(conversationId: string, page = 0, limit = 50) {
    if (!useMemory()) {
      return this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        skip: page * limit,
        take: limit,
        include: { attachments: true }
      }).then((items) => items.reverse());
    }
    seedMemory();
    return this.prisma.message
      .findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        skip: page * limit,
        take: limit,
        include: { attachments: true }
      })
      .then((items) => items.reverse())
      .catch(() => {
        const items = memoryStore.messages
          .filter((m) => m.conversationId === conversationId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(page * limit, page * limit + limit)
          .reverse();
        return items;
      });
  }

  sendMessage(conversationId: string, senderId: string, text: string) {
    if (!useMemory()) {
      return this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          text: sanitizeMessage(text)
        },
        include: { attachments: true }
      }).then(async (message) => {
        this.gateway.emitMessage(message);
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
        this.gateway.emitMessage(message);
        const convo = memoryStore.conversations.find((c) => c.id === conversationId);
        if (convo) {
          convo.participants
            .filter((id) => id !== senderId)
            .forEach((id) => this.notifications.create(id, "New message", "You received a new message."));
        }
        return message as any;
      });
  }

  async sendAttachment(conversationId: string, senderId: string, file: Express.Multer.File, text?: string) {
    const sanitizedText = text ? sanitizeMessage(text) : "Sent an attachment";
    const stored = await this.storage.save(file, "attachments");

    if (!useMemory()) {
      const message = await this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          text: sanitizedText,
          attachments: {
            create: {
              url: stored.url,
              type: file.mimetype
            }
          }
        },
        include: { attachments: true }
      });
      this.gateway.emitMessage(message);
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
    }

    seedMemory();
    const message = await this.prisma.message
      .create({
        data: {
          conversationId,
          senderId,
          text: sanitizedText,
          attachments: {
            create: {
              url: stored.url,
              type: file.mimetype
            }
          }
        },
        include: { attachments: true }
      })
      .catch(() => {
        const created = {
          id: createId(),
          conversationId,
          senderId,
          text: sanitizedText,
          createdAt: new Date()
        };
        memoryStore.messages.push(created);
        return { ...created, attachments: [{ url: stored.url, type: file.mimetype }] } as any;
      });
    this.gateway.emitMessage(message);
    const convo = memoryStore.conversations.find((c) => c.id === conversationId);
    if (convo) {
      convo.participants
        .filter((id) => id !== senderId)
        .forEach((id) => this.notifications.create(id, "New message", "You received a new message."));
    }
    return message;
  }
}
