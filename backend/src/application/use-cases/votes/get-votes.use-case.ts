import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository';
import { IVoteRepository, VOTE_REPOSITORY } from '../../../domain/repositories/vote.repository';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { TicketStatus } from '../../../domain/enums/ticket-status.enum';

@Injectable()
export class GetVotesUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
    @Inject(VOTE_REPOSITORY) private readonly voteRepo: IVoteRepository,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(ticketId: string, sessionToken?: string) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    const votes = await this.voteRepo.findByTicketId(ticketId);
    const revealed = ticket.status === TicketStatus.REVEALED || ticket.status === TicketStatus.COMPLETED;
    const enriched = await Promise.all(
      votes.map(async (v) => {
        const user = await this.userRepo.findById(v.userId);
        return { ...v, userName: user?.name, value: revealed ? v.value : 'hidden' };
      }),
    );
    return { votes: enriched, revealed };
  }
}
