import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { Server, Socket } from "socket.io";

const corsOrigin = process.env.CORS_ORIGIN || (process.env.NODE_ENV === "production" ? "" : "*");

@WebSocketGateway({
  cors: {
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: true
  }
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    const candidate = client.handshake.auth?.token || client.handshake.headers.authorization;
    const token = typeof candidate === "string" ? candidate.replace(/^Bearer\s+/i, "") : "";
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; role: string }>(token);
      if (!payload.sub) throw new Error("Missing subject");
      client.data.user = { id: payload.sub, role: payload.role };
      client.emit("connection.ready", { ok: true });
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect() {}

  @SubscribeMessage("conversation.join")
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string }
  ) {
    if (!(await this.isParticipant(payload?.conversationId, client.data.user?.id))) {
      return { ok: false };
    }
    await client.join(this.room(payload.conversationId));
    return { ok: true };
  }

  @SubscribeMessage("typing")
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; typing: boolean }
  ) {
    if (!(await this.isParticipant(payload?.conversationId, client.data.user?.id))) {
      return { ok: false };
    }
    await client.join(this.room(payload.conversationId));
    client.to(this.room(payload.conversationId)).emit("typing", {
      conversationId: payload.conversationId,
      userId: client.data.user.id,
      typing: Boolean(payload.typing)
    });
    return { ok: true };
  }

  @SubscribeMessage("read.receipt")
  async handleReadReceipt(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; messageId?: string }
  ) {
    const userId = client.data.user?.id;
    if (!(await this.isParticipant(payload?.conversationId, userId))) return { ok: false };
    if (payload.messageId) {
      const message = await this.prisma.message.findFirst({
        where: { id: payload.messageId, conversationId: payload.conversationId },
        select: { id: true }
      });
      if (!message) return { ok: false };
    }
    await client.join(this.room(payload.conversationId));
    client.to(this.room(payload.conversationId)).emit("read.receipt", {
      conversationId: payload.conversationId,
      userId,
      messageId: payload.messageId
    });
    return { ok: true };
  }

  emitMessage(payload: { conversationId: string }) {
    this.server.to(this.room(payload.conversationId)).emit("message.new", payload);
  }

  private async isParticipant(conversationId: string | undefined, userId: string | undefined) {
    if (!conversationId || !userId) return false;
    return !!(await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
      select: { id: true }
    }));
  }

  private room(conversationId: string) {
    return `conversation:${conversationId}`;
  }
}
