import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository';
import { TicketStatus } from '../../../domain/enums/ticket-status.enum';

@Injectable()
export class StartVotingUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
  ) {}

  async execute(ticketId: string) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.PENDING) throw new BadRequestException('Ticket is not in PENDING status');
    return this.ticketRepo.updateStatus(ticketId, TicketStatus.VOTING);
  }
}
