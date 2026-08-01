import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Hall } from '../../../common/enums/hall.enum';

export class FindTeamsQueryDto {
  @ApiPropertyOptional({ enum: Hall })
  @IsOptional()
  @IsEnum(Hall)
  hall?: Hall;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  teamNumber?: number;
}
