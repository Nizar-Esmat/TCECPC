import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';
import { Hall } from '../../../common/enums/hall.enum';

export class CreateTeamDto {
  @ApiProperty({ enum: Hall, example: Hall.HALL_1 })
  @IsEnum(Hall)
  hall: Hall;

  @ApiProperty({ example: 12, minimum: 1 })
  @IsInt()
  @Min(1)
  teamNumber: number;
}
