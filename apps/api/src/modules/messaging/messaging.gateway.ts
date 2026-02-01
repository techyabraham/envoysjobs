import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  emitMessage(payload: any) {
    this.server.emit("message.new", payload);
  }
}
