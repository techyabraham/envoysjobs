"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const utils_1 = require("@envoysjobs/utils");
const memory_store_1 = require("../../common/memory.store");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
let MessagingService = class MessagingService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    listConversations(userId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.conversation.findMany({
                where: {
                    participants: { some: { userId } }
                },
                include: { job: true, messages: { take: 1, orderBy: { createdAt: "desc" } } }
            });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.conversation
            .findMany({
            where: {
                participants: { some: { userId } }
            },
            include: { job: true, messages: { take: 1, orderBy: { createdAt: "desc" } } }
        })
            .catch(() => {
            return memory_store_1.memoryStore.conversations
                .filter((conv) => conv.participants.includes(userId))
                .map((conv) => {
                const job = memory_store_1.memoryStore.jobs.find((j) => j.id === conv.jobId);
                const messages = memory_store_1.memoryStore.messages
                    .filter((m) => m.conversationId === conv.id)
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .slice(0, 1);
                return { ...conv, job, messages };
            });
        });
    }
    async getOrCreateConversation(data) {
        if (!(0, memory_store_1.useMemory)()) {
            const existing = await this.prisma.conversation.findFirst({
                where: { jobId: data.jobId, participants: { every: { userId: { in: [data.envoyId, data.hirerId] } } } }
            });
            if (existing)
                return existing;
            return this.prisma.conversation.create({
                data: {
                    jobId: data.jobId,
                    participants: {
                        create: [{ userId: data.envoyId }, { userId: data.hirerId }]
                    }
                }
            });
        }
        (0, memory_store_1.seedMemory)();
        const existing = await this.prisma.conversation
            .findFirst({
            where: { jobId: data.jobId, participants: { every: { userId: { in: [data.envoyId, data.hirerId] } } } }
        })
            .catch(() => {
            return memory_store_1.memoryStore.conversations.find((conv) => conv.jobId === data.jobId &&
                conv.participants.includes(data.envoyId) &&
                conv.participants.includes(data.hirerId));
        });
        if (existing)
            return existing;
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
                id: (0, memory_store_1.createId)(),
                jobId: data.jobId,
                participants: [data.envoyId, data.hirerId],
                createdAt: new Date()
            };
            memory_store_1.memoryStore.conversations.push(conversation);
            return conversation;
        });
    }
    listMessages(conversationId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: "asc" },
                include: { attachments: true }
            });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.message
            .findMany({ where: { conversationId }, orderBy: { createdAt: "asc" }, include: { attachments: true } })
            .catch(() => {
            return memory_store_1.memoryStore.messages
                .filter((m) => m.conversationId === conversationId)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        });
    }
    sendMessage(conversationId, senderId, text) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.message.create({
                data: {
                    conversationId,
                    senderId,
                    text: (0, utils_1.sanitizeMessage)(text)
                },
                include: { attachments: true }
            }).then(async (message) => {
                const convo = await this.prisma.conversation.findUnique({
                    where: { id: conversationId },
                    include: { participants: true }
                });
                if (convo) {
                    const recipients = convo.participants.filter((p) => p.userId !== senderId);
                    await Promise.all(recipients.map((p) => this.notifications.create(p.userId, "New message", "You received a new message.")));
                }
                return message;
            });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.message
            .create({
            data: {
                conversationId,
                senderId,
                text: (0, utils_1.sanitizeMessage)(text)
            }
        })
            .catch(() => {
            const message = {
                id: (0, memory_store_1.createId)(),
                conversationId,
                senderId,
                text: (0, utils_1.sanitizeMessage)(text),
                createdAt: new Date()
            };
            memory_store_1.memoryStore.messages.push(message);
            const convo = memory_store_1.memoryStore.conversations.find((c) => c.id === conversationId);
            if (convo) {
                convo.participants
                    .filter((id) => id !== senderId)
                    .forEach((id) => this.notifications.create(id, "New message", "You received a new message."));
            }
            return message;
        });
    }
    async sendAttachment(conversationId, senderId, file, text) {
        const sanitizedText = text ? (0, utils_1.sanitizeMessage)(text) : "Sent an attachment";
        const uploadsDir = path_1.default.join(process.cwd(), "apps/api/uploads");
        await fs_1.promises.mkdir(uploadsDir, { recursive: true });
        const filename = `${senderId}-${Date.now()}-${file.originalname}`.replace(/\\s+/g, "_");
        const filePath = path_1.default.join(uploadsDir, filename);
        await fs_1.promises.writeFile(filePath, file.buffer);
        if (!(0, memory_store_1.useMemory)()) {
            const message = await this.prisma.message.create({
                data: {
                    conversationId,
                    senderId,
                    text: sanitizedText,
                    attachments: {
                        create: {
                            url: `/uploads/${filename}`,
                            type: file.mimetype
                        }
                    }
                },
                include: { attachments: true }
            });
            const convo = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: true }
            });
            if (convo) {
                const recipients = convo.participants.filter((p) => p.userId !== senderId);
                await Promise.all(recipients.map((p) => this.notifications.create(p.userId, "New message", "You received a new message.")));
            }
            return message;
        }
        (0, memory_store_1.seedMemory)();
        const message = await this.prisma.message
            .create({
            data: {
                conversationId,
                senderId,
                text: sanitizedText,
                attachments: {
                    create: {
                        url: `/uploads/${filename}`,
                        type: file.mimetype
                    }
                }
            },
            include: { attachments: true }
        })
            .catch(() => {
            const created = {
                id: (0, memory_store_1.createId)(),
                conversationId,
                senderId,
                text: sanitizedText,
                createdAt: new Date()
            };
            memory_store_1.memoryStore.messages.push(created);
            return { ...created, attachments: [{ url: `/uploads/${filename}`, type: file.mimetype }] };
        });
        const convo = memory_store_1.memoryStore.conversations.find((c) => c.id === conversationId);
        if (convo) {
            convo.participants
                .filter((id) => id !== senderId)
                .forEach((id) => this.notifications.create(id, "New message", "You received a new message."));
        }
        return message;
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService])
], MessagingService);
