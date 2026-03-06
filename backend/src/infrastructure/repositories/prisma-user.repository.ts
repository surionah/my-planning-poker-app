import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; role: UserRole; roomId: string }): Promise<UserEntity> {
    return this.prisma.user.create({ data }) as any;
  }

  async findBySessionToken(token: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { sessionToken: token } }) as any;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { id } }) as any;
  }

  async findByRoomId(roomId: string): Promise<UserEntity[]> {
    return this.prisma.user.findMany({ where: { roomId }, orderBy: { createdAt: 'asc' } }) as any;
  }

  async updateOnlineStatus(id: string, isOnline: boolean): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: { isOnline } }) as any;
  }

  async updateRole(id: string, role: UserRole): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: { role } }) as any;
  }
}
