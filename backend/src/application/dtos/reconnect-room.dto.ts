import { IsString } from 'class-validator';

export class ReconnectRoomDto {
  @IsString()
  sessionToken: string;
}
