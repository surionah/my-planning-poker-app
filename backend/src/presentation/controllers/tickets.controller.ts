import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CreateTicketUseCase } from '../../application/use-cases/tickets/create-ticket.use-case';
import { GetTicketsUseCase } from '../../application/use-cases/tickets/get-tickets.use-case';
import { StartVotingUseCase } from '../../application/use-cases/tickets/start-voting.use-case';
import { RevealVotesUseCase } from '../../application/use-cases/tickets/reveal-votes.use-case';
import { CompleteTicketUseCase } from '../../application/use-cases/tickets/complete-ticket.use-case';
import { CreateTicketDto } from '../../application/dtos/create-ticket.dto';
import { CompleteTicketDto } from '../../application/dtos/complete-ticket.dto';
import { ModeratorGuard } from '../guards/moderator.guard';
import { PlanningPokerGateway } from '../../infrastructure/websockets/planning-poker.gateway';

@Controller('api/rooms/:code/tickets')
export class TicketsController {
  constructor(
    private readonly createTicket: CreateTicketUseCase,
    private readonly getTickets: GetTicketsUseCase,
    private readonly startVoting: StartVotingUseCase,
    private readonly revealVotes: RevealVotesUseCase,
    private readonly completeTicket: CompleteTicketUseCase,
    private readonly gateway: PlanningPokerGateway,
  ) {}

  @Post()
  @UseGuards(ModeratorGuard)
  async create(@Param('code') code: string, @Body() dto: CreateTicketDto) {
    const ticket = await this.createTicket.execute(code, dto);
    this.gateway.emitToRoom(code, 'ticket:created', ticket);
    return ticket;
  }

  @Get()
  findAll(@Param('code') code: string) {
    return this.getTickets.execute(code);
  }

  @Patch(':id/start-voting')
  @UseGuards(ModeratorGuard)
  async start(@Param('code') code: string, @Param('id') id: string) {
    const ticket = await this.startVoting.execute(id);
    this.gateway.emitToRoom(code, 'ticket:voting-started', ticket);
    return ticket;
  }

  @Patch(':id/reveal')
  @UseGuards(ModeratorGuard)
  async reveal(@Param('code') code: string, @Param('id') id: string) {
    const result = await this.revealVotes.execute(id);
    this.gateway.emitToRoom(code, 'ticket:votes-revealed', result);
    return result;
  }

  @Patch(':id/complete')
  @UseGuards(ModeratorGuard)
  async complete(@Param('code') code: string, @Param('id') id: string, @Body() dto: CompleteTicketDto) {
    const ticket = await this.completeTicket.execute(id, dto);
    this.gateway.emitToRoom(code, 'ticket:completed', ticket);
    return ticket;
  }
}
