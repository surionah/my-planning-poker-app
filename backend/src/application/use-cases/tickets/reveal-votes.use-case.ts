import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository';
import { IVoteRepository, VOTE_REPOSITORY } from '../../../domain/repositories/vote.repository';
import { TicketStatus } from '../../../domain/enums/ticket-status.enum';

@Injectable()
export class RevealVotesUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
    @Inject(VOTE_REPOSITORY) private readonly voteRepo: IVoteRepository,
  ) {}

  async execute(ticketId: string) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.VOTING) throw new BadRequestException('Ticket is not in VOTING status');
    const updatedTicket = await this.ticketRepo.updateStatus(ticketId, TicketStatus.REVEALED);
    const votes = await this.voteRepo.findByTicketId(ticketId);
    return { ticket: updatedTicket, votes };
  }
}
