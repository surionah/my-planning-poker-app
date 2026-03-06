import { IsString, MinLength, MaxLength } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
