import { Controller, Post, Get, Body, Param, Query, Inject } from '@nestjs/common';
import { CastVoteUseCase } from '../../application/use-cases/votes/cast-vote.use-case';
import { GetVotesUseCase } from '../../application/use-cases/votes/get-votes.use-case';
import { CastVoteDto } from '../../application/dtos/cast-vote.dto';
import { PlanningPokerGateway } from '../../infrastructure/websockets/planning-poker.gateway';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Controller('api/rooms/:code/tickets/:ticketId/votes')
export class VotesController {
  constructor(
    private readonly castVote: CastVoteUseCase,
    private readonly getVotes: GetVotesUseCase,
    private readonly gateway: PlanningPokerGateway,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  @Post()
  async cast(@Param('code') code: string, @Param('ticketId') ticketId: string, @Body() dto: CastVoteDto) {
    const vote = await this.castVote.execute(ticketId, dto);
    const user = await this.userRepo.findBySessionToken(dto.sessionToken);
    this.gateway.emitToRoom(code, 'vote:cast', { ticketId, userId: user?.id, userName: user?.name, voted: true });
    return vote;
  }

  @Get()
  findAll(@Param('ticketId') ticketId: string, @Query('sessionToken') sessionToken?: string) {
    return this.getVotes.execute(ticketId, sessionToken);
  }
}
