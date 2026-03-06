import { Injectable, Inject } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { CreateRoomDto } from '../../dtos/create-room.dto';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: CreateRoomDto) {
    const code = this.generateCode();
    const room = await this.roomRepo.create({ name: dto.name, code });
    const moderator = await this.userRepo.create({
      name: dto.moderatorName,
      role: UserRole.MODERATOR,
      roomId: room.id,
    });
    return { room, user: moderator, sessionToken: moderator.sessionToken };
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
