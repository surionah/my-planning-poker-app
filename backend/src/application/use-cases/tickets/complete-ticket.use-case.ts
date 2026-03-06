import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository';
import { TicketStatus } from '../../../domain/enums/ticket-status.enum';
import { CompleteTicketDto } from '../../dtos/complete-ticket.dto';

@Injectable()
export class CompleteTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
  ) {}

  async execute(ticketId: string, dto: CompleteTicketDto) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.REVEALED) throw new BadRequestException('Ticket votes must be revealed first');
    return this.ticketRepo.updateFinalEstimate(ticketId, dto.finalEstimate, TicketStatus.COMPLETED);
  }
}
