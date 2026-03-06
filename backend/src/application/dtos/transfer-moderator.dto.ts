import { IsString } from 'class-validator';

export class TransferModeratorDto {
  @IsString()
  newModeratorId: string;
}
