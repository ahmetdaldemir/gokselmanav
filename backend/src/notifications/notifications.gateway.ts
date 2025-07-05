import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface OrderData {
  id: number;
  customerId: number;
  totalAmount: number;
  customer?: {
    firstName: string;
    lastName: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private adminSockets: Set<string> = new Set();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.adminSockets.delete(client.id);
  }

  @SubscribeMessage('joinAdminRoom')
  handleJoinAdminRoom(client: Socket) {
    client.join('admin-room');
    this.adminSockets.add(client.id);
    console.log(`Admin joined room: ${client.id}`);
  }

  @SubscribeMessage('leaveAdminRoom')
  handleLeaveAdminRoom(client: Socket) {
    client.leave('admin-room');
    this.adminSockets.delete(client.id);
    console.log(`Admin left room: ${client.id}`);
  }

  // Yeni sipariş geldiğinde admin'lere bildirim gönder
  notifyNewOrder(orderData: OrderData) {
    this.server.to('admin-room').emit('newOrder', {
      type: 'newOrder',
      message: 'Yeni sipariş alındı!',
      order: orderData,
      timestamp: new Date(),
    });
  }

  // Genel bildirim gönderme metodu
  sendNotification(room: string, data: any) {
    this.server.to(room).emit('notification', data);
  }
} 