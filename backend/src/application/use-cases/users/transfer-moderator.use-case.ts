import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository';
import { UserRole } from '../../../domain/enums/user-role.enum';

@Injectable()
export class TransferModeratorUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(ROOM_REPOSITORY) private readonly roomRepo: IRoomRepository,
  ) {}

  async execute(roomCode: string, currentModeratorId: string, newModeratorId: string) {
    const room = await this.roomRepo.findByCode(roomCode);
    if (!room) throw new NotFoundException(`Room ${roomCode} not found`);

    const newModerator = await this.userRepo.findById(newModeratorId);
    if (!newModerator) throw new NotFoundException('User not found');
    if (newModerator.roomId !== room.id) throw new BadRequestException('User is not in this room');
    if (newModerator.role === UserRole.MODERATOR) throw new BadRequestException('User is already a moderator');

    await this.userRepo.updateRole(currentModeratorId, UserRole.GUEST);
    const promoted = await this.userRepo.updateRole(newModeratorId, UserRole.MODERATOR);

    return { newModerator: promoted };
  }
}
