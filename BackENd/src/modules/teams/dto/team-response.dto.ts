import { ApiProperty } from '@nestjs/swagger';
import { Hall } from '../../../common/enums/hall.enum';
import { Team } from '../entities/team.entity';

export class TeamResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: Hall })
  hall: Hall;

  @ApiProperty()
  teamNumber: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(team: Team) {
    this.id = team.id;
    this.hall = team.hall;
    this.teamNumber = team.teamNumber;
    this.createdAt = team.createdAt;
    this.updatedAt = team.updatedAt;
  }
}
