import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { IVoteRepository } from '../../domain/repositories/vote.repository';
import { VoteEntity } from '../../domain/entities/vote.entity';

@Injectable()
export class PrismaVoteRepository implements IVoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(data: { userId: string; ticketId: string; value: string }): Promise<VoteEntity> {
    return this.prisma.vote.upsert({
      where: { userId_ticketId: { userId: data.userId, ticketId: data.ticketId } },
      update: { value: data.value },
      create: data,
    }) as any;
  }

  async findByTicketId(ticketId: string): Promise<VoteEntity[]> {
    return this.prisma.vote.findMany({ where: { ticketId } }) as any;
  }

  async findByUserAndTicket(userId: string, ticketId: string): Promise<VoteEntity | null> {
    return this.prisma.vote.findUnique({ where: { userId_ticketId: { userId, ticketId } } }) as any;
  }

  async countByTicketId(ticketId: string): Promise<number> {
    return this.prisma.vote.count({ where: { ticketId } });
  }
}
