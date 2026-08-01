import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

export class ImportTeamsDto {
  @ApiProperty({ type: [CreateTeamDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamDto)
  teams: CreateTeamDto[];
}
