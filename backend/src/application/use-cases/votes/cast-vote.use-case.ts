import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { IVoteRepository, VOTE_REPOSITORY } from '../../../domain/repositories/vote.repository';
import { TicketStatus } from '../../../domain/enums/ticket-status.enum';
import { CastVoteDto } from '../../dtos/cast-vote.dto';

const VALID_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '∞', '☕'];

@Injectable()
export class CastVoteUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(VOTE_REPOSITORY) private readonly voteRepo: IVoteRepository,
  ) {}

  async execute(ticketId: string, dto: CastVoteDto) {
    if (!VALID_VALUES.includes(dto.value)) throw new BadRequestException(`Invalid vote value: ${dto.value}`);
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.VOTING) throw new BadRequestException('Ticket is not open for voting');
    const user = await this.userRepo.findBySessionToken(dto.sessionToken);
    if (!user) throw new NotFoundException('User not found');
    return this.voteRepo.upsert({ userId: user.id, ticketId, value: dto.value });
  }
}
