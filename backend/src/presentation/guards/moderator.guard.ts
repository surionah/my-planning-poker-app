import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserRole } from '../../domain/enums/user-role.enum';
import { Request } from 'express';

@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const sessionToken = req.headers['x-session-token'] as string;
    if (!sessionToken) throw new ForbiddenException('Session token required');
    const user = await this.userRepo.findBySessionToken(sessionToken);
    if (!user || user.role !== UserRole.MODERATOR) throw new ForbiddenException('Moderator access required');
    (req as any).user = user;
    return true;
  }
}
