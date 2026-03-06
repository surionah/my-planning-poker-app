import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export interface IUserRepository {
  create(data: { name: string; role: UserRole; roomId: string }): Promise<UserEntity>;
  findBySessionToken(token: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findByRoomId(roomId: string): Promise<UserEntity[]>;
  updateOnlineStatus(id: string, isOnline: boolean): Promise<UserEntity>;
  updateRole(id: string, role: UserRole): Promise<UserEntity>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
