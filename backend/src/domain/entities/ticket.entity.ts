import { TicketStatus } from '../enums/ticket-status.enum';

export class TicketEntity {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  finalEstimate?: string;
  order: number;
  roomId: string;
  createdAt: Date;
}
