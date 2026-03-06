import { TicketEntity } from '../entities/ticket.entity';
import { TicketStatus } from '../enums/ticket-status.enum';

export interface ITicketRepository {
  create(data: { title: string; description?: string; roomId: string; order: number }): Promise<TicketEntity>;
  findByRoomId(roomId: string): Promise<TicketEntity[]>;
  findById(id: string): Promise<TicketEntity | null>;
  updateStatus(id: string, status: TicketStatus): Promise<TicketEntity>;
  updateFinalEstimate(id: string, finalEstimate: string, status: TicketStatus): Promise<TicketEntity>;
  countByRoomId(roomId: string): Promise<number>;
}

export const TICKET_REPOSITORY = 'TICKET_REPOSITORY';
