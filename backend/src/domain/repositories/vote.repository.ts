import { VoteEntity } from '../entities/vote.entity';

export interface IVoteRepository {
  upsert(data: { userId: string; ticketId: string; value: string }): Promise<VoteEntity>;
  findByTicketId(ticketId: string): Promise<VoteEntity[]>;
  findByUserAndTicket(userId: string, ticketId: string): Promise<VoteEntity | null>;
  countByTicketId(ticketId: string): Promise<number>;
}

export const VOTE_REPOSITORY = 'VOTE_REPOSITORY';
