import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { JoinRoomDto } from '../../dtos/join-room.dto';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(roomCode: string, dto: JoinRoomDto) {
    const room = await this.roomRepo.findByCode(roomCode);
    if (!room) throw new NotFoundException(`Room ${roomCode} not found`);
    const user = await this.userRepo.create({
      name: dto.name,
      role: UserRole.GUEST,
      roomId: room.id,
    });
    return { room, user, sessionToken: user.sessionToken };
  }
}
