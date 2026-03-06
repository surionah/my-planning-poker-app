import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CreateRoomUseCase } from '../../application/use-cases/rooms/create-room.use-case';
import { GetRoomUseCase } from '../../application/use-cases/rooms/get-room.use-case';
import { JoinRoomUseCase } from '../../application/use-cases/users/join-room.use-case';
import { ReconnectUserUseCase } from '../../application/use-cases/users/reconnect-user.use-case';
import { GetParticipantsUseCase } from '../../application/use-cases/users/get-participants.use-case';
import { TransferModeratorUseCase } from '../../application/use-cases/users/transfer-moderator.use-case';
import { CreateRoomDto } from '../../application/dtos/create-room.dto';
import { JoinRoomDto } from '../../application/dtos/join-room.dto';
import { ReconnectRoomDto } from '../../application/dtos/reconnect-room.dto';
import { TransferModeratorDto } from '../../application/dtos/transfer-moderator.dto';
import { ModeratorGuard } from '../guards/moderator.guard';
import { PlanningPokerGateway } from '../../infrastructure/websockets/planning-poker.gateway';
import { Request } from 'express';

@Controller('api/rooms')
export class RoomsController {
  constructor(
    private readonly createRoom: CreateRoomUseCase,
    private readonly getRoom: GetRoomUseCase,
    private readonly joinRoom: JoinRoomUseCase,
    private readonly reconnectUser: ReconnectUserUseCase,
    private readonly getParticipants: GetParticipantsUseCase,
    private readonly transferModerator: TransferModeratorUseCase,
    private readonly gateway: PlanningPokerGateway,
  ) {}

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.createRoom.execute(dto);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.getRoom.execute(code);
  }

  @Post(':code/join')
  join(@Param('code') code: string, @Body() dto: JoinRoomDto) {
    return this.joinRoom.execute(code, dto);
  }

  @Post(':code/reconnect')
  reconnect(@Param('code') code: string, @Body() dto: ReconnectRoomDto) {
    return this.reconnectUser.execute(code, dto.sessionToken);
  }

  @Get(':code/participants')
  participants(@Param('code') code: string) {
    return this.getParticipants.execute(code);
  }

  @Patch(':code/transfer-moderator')
  @UseGuards(ModeratorGuard)
  async transfer(
    @Param('code') code: string,
    @Body() dto: TransferModeratorDto,
    @Req() req: Request,
  ) {
    const currentModerator = (req as any).user;
    const result = await this.transferModerator.execute(code, currentModerator.id, dto.newModeratorId);
    this.gateway.emitToRoom(code, 'moderator:transferred', {
      newModeratorId: result.newModerator.id,
      previousModeratorId: currentModerator.id,
    });
    return result;
  }
}
