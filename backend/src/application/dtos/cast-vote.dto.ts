import { IsString } from 'class-validator';

export class CastVoteDto {
  @IsString()
  value: string;

  @IsString()
  sessionToken: string;
}
