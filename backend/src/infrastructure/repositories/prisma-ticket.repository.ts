import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { ITicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import { TicketStatus } from '../../domain/enums/ticket-status.enum';

@Injectable()
export class PrismaTicketRepository implements ITicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; description?: string; roomId: string; order: number }): Promise<TicketEntity> {
    return this.prisma.ticket.create({ data }) as any;
  }

  async findByRoomId(roomId: string): Promise<TicketEntity[]> {
    return this.prisma.ticket.findMany({ where: { roomId }, orderBy: { order: 'asc' } }) as any;
  }

  async findById(id: string): Promise<TicketEntity | null> {
    return this.prisma.ticket.findUnique({ where: { id } }) as any;
  }

  async updateStatus(id: string, status: TicketStatus): Promise<TicketEntity> {
    return this.prisma.ticket.update({ where: { id }, data: { status } }) as any;
  }

  async updateFinalEstimate(id: string, finalEstimate: string, status: TicketStatus): Promise<TicketEntity> {
    return this.prisma.ticket.update({ where: { id }, data: { finalEstimate, status } }) as any;
  }

  async countByRoomId(roomId: string): Promise<number> {
    return this.prisma.ticket.count({ where: { roomId } });
  }
}
