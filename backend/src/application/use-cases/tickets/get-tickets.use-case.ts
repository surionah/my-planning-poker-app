import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository';

@Injectable()
export class GetTicketsUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
  ) {}

  async execute(roomCode: string) {
    const room = await this.roomRepo.findByCode(roomCode);
    if (!room) throw new NotFoundException(`Room ${roomCode} not found`);
    return this.ticketRepo.findByRoomId(room.id);
  }
}
