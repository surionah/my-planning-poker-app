import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { IRoomRepository } from '../../domain/repositories/room.repository';
import { RoomEntity } from '../../domain/entities/room.entity';

@Injectable()
export class PrismaRoomRepository implements IRoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; code: string }): Promise<RoomEntity> {
    return this.prisma.room.create({ data });
  }

  async findByCode(code: string): Promise<RoomEntity | null> {
    return this.prisma.room.findUnique({ where: { code } });
  }

  async findById(id: string): Promise<RoomEntity | null> {
    return this.prisma.room.findUnique({ where: { id } });
  }
}
