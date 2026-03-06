import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository';
import { CreateTicketDto } from '../../dtos/create-ticket.dto';

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
  ) {}

  async execute(roomCode: string, dto: CreateTicketDto) {
    const room = await this.roomRepo.findByCode(roomCode);
    if (!room) throw new NotFoundException(`Room ${roomCode} not found`);
    const count = await this.ticketRepo.countByRoomId(room.id);
    return this.ticketRepo.create({ ...dto, roomId: room.id, order: count + 1 });
  }
}
