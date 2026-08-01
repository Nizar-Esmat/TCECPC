import { ApiProperty } from '@nestjs/swagger';
import { Hall } from '../../../common/enums/hall.enum';
import { TeamResponseDto } from './team-response.dto';

export class SkippedTeamDto {
  @ApiProperty({ enum: Hall })
  hall: Hall;

  @ApiProperty()
  teamNumber: number;

  @ApiProperty()
  reason: string;
}

export class ImportTeamsResponseDto {
  @ApiProperty({ type: [TeamResponseDto] })
  created: TeamResponseDto[];

  @ApiProperty({ type: [SkippedTeamDto] })
  skipped: SkippedTeamDto[];
}
