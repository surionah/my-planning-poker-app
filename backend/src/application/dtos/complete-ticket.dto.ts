import { IsString } from 'class-validator';

export class CompleteTicketDto {
  @IsString()
  finalEstimate: string;
}
