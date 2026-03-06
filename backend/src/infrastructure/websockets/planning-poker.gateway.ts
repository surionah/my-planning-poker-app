import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class PlanningPokerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private socketToUser: Map<string, { userId: string; roomCode: string }> = new Map();

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async handleConnection(client: Socket) {
    // Connection tracked after room:join
  }

  async handleDisconnect(client: Socket) {
    const info = this.socketToUser.get(client.id);
    if (info) {
      await this.userRepo.updateOnlineStatus(info.userId, false);
      client.to(info.roomCode).emit('participant:left', { userId: info.userId });
      this.socketToUser.delete(client.id);
    }
  }

  @SubscribeMessage('room:join')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; sessionToken: string },
  ) {
    const user = await this.userRepo.findBySessionToken(data.sessionToken);
    if (!user) {
      client.emit('error', { message: 'Invalid session token' });
      return;
    }
    await this.userRepo.updateOnlineStatus(user.id, true);
    client.join(data.roomCode);
    this.socketToUser.set(client.id, { userId: user.id, roomCode: data.roomCode });
    client.to(data.roomCode).emit('participant:joined', { userId: user.id, name: user.name, role: user.role });
    client.emit('room:joined', { userId: user.id });
  }

  @SubscribeMessage('room:leave')
  async handleRoomLeave(@ConnectedSocket() client: Socket) {
    const info = this.socketToUser.get(client.id);
    if (info) {
      await this.userRepo.updateOnlineStatus(info.userId, false);
      client.leave(info.roomCode);
      client.to(info.roomCode).emit('participant:left', { userId: info.userId });
      this.socketToUser.delete(client.id);
    }
  }

  // Methods called by controllers to broadcast events
  emitToRoom(roomCode: string, event: string, data: any) {
    this.server.to(roomCode).emit(event, data);
  }
}
