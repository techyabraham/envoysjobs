import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(@ConnectedSocket() client: any) {
    client.emit("connection.ready", { ok: true });
  }

  handleDisconnect() {}

  @SubscribeMessage("typing")
  handleTyping(@MessageBody() payload: { conversationId: string; userId: string; typing: boolean }) {
    this.server.emit("typing", payload);
    return { ok: true };
  }

  @SubscribeMessage("read.receipt")
  handleReadReceipt(@MessageBody() payload: { conversationId: string; userId: string; messageId?: string }) {
    this.server.emit("read.receipt", payload);
    return { ok: true };
  }

  emitMessage(payload: any) {
    this.server.emit("message.new", payload);
  }
}
