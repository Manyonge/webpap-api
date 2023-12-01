import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PaymentsGateway {
  @WebSocketServer()
  server: Server;

  sendMessageToClients(event: string, data: any) {
    this.server.emit(event, data);
  }
}
