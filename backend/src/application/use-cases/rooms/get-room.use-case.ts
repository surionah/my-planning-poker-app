import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';

@Injectable()
export class GetRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
  ) {}

  async execute(code: string) {
    const room = await this.roomRepo.findByCode(code);
    if (!room) throw new NotFoundException(`Room with code ${code} not found`);
    return room;
  }
}
