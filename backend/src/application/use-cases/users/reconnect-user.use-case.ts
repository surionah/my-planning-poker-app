import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';

@Injectable()
export class ReconnectUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
  ) {}

  async execute(roomCode: string, sessionToken: string) {
    const user = await this.userRepo.findBySessionToken(sessionToken);
    if (!user) throw new UnauthorizedException('Invalid session token');
    const room = await this.roomRepo.findByCode(roomCode);
    if (!room || room.id !== user.roomId) throw new UnauthorizedException('Session not valid for this room');
    return { room, user };
  }
}
