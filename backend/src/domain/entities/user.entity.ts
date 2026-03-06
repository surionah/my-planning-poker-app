import { UserRole } from '../enums/user-role.enum';

export class UserEntity {
  id: string;
  name: string;
  role: UserRole;
  sessionToken: string;
  isOnline: boolean;
  roomId: string;
  createdAt: Date;
}
