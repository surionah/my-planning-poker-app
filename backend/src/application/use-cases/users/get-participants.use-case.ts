import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';

@Injectable()
export class GetParticipantsUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(roomCode: string) {
    const room = await this.roomRepo.findByCode(roomCode);
    if (!room) throw new NotFoundException(`Room ${roomCode} not found`);
    return this.userRepo.findByRoomId(room.id);
  }
}
