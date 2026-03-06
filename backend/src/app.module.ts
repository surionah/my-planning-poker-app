import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { PrismaRoomRepository } from './infrastructure/repositories/prisma-room.repository';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { PrismaTicketRepository } from './infrastructure/repositories/prisma-ticket.repository';
import { PrismaVoteRepository } from './infrastructure/repositories/prisma-vote.repository';
import { ROOM_REPOSITORY } from './domain/repositories/room.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { TICKET_REPOSITORY } from './domain/repositories/ticket.repository';
import { VOTE_REPOSITORY } from './domain/repositories/vote.repository';
import { PlanningPokerGateway } from './infrastructure/websockets/planning-poker.gateway';
import { RoomsController } from './presentation/controllers/rooms.controller';
import { TicketsController } from './presentation/controllers/tickets.controller';
import { VotesController } from './presentation/controllers/votes.controller';
import { ModeratorGuard } from './presentation/guards/moderator.guard';
import { CreateRoomUseCase } from './application/use-cases/rooms/create-room.use-case';
import { GetRoomUseCase } from './application/use-cases/rooms/get-room.use-case';
import { JoinRoomUseCase } from './application/use-cases/users/join-room.use-case';
import { ReconnectUserUseCase } from './application/use-cases/users/reconnect-user.use-case';
import { GetParticipantsUseCase } from './application/use-cases/users/get-participants.use-case';
import { TransferModeratorUseCase } from './application/use-cases/users/transfer-moderator.use-case';
import { CreateTicketUseCase } from './application/use-cases/tickets/create-ticket.use-case';
import { GetTicketsUseCase } from './application/use-cases/tickets/get-tickets.use-case';
import { StartVotingUseCase } from './application/use-cases/tickets/start-voting.use-case';
import { RevealVotesUseCase } from './application/use-cases/tickets/reveal-votes.use-case';
import { CompleteTicketUseCase } from './application/use-cases/tickets/complete-ticket.use-case';
import { CastVoteUseCase } from './application/use-cases/votes/cast-vote.use-case';
import { GetVotesUseCase } from './application/use-cases/votes/get-votes.use-case';

const repositories = [
  { provide: ROOM_REPOSITORY, useClass: PrismaRoomRepository },
  { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  { provide: TICKET_REPOSITORY, useClass: PrismaTicketRepository },
  { provide: VOTE_REPOSITORY, useClass: PrismaVoteRepository },
];

const useCases = [
  CreateRoomUseCase, GetRoomUseCase,
  JoinRoomUseCase, ReconnectUserUseCase, GetParticipantsUseCase, TransferModeratorUseCase,
  CreateTicketUseCase, GetTicketsUseCase, StartVotingUseCase, RevealVotesUseCase, CompleteTicketUseCase,
  CastVoteUseCase, GetVotesUseCase,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [RoomsController, TicketsController, VotesController],
  providers: [
    PrismaService,
    ...repositories,
    ...useCases,
    PlanningPokerGateway,
    ModeratorGuard,
  ],
})
export class AppModule {}
