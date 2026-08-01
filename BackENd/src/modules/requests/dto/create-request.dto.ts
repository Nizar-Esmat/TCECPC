import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { RequestType } from '../../../common/enums/request-type.enum';

export class CreateRequestDto {
  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiProperty({ enum: RequestType, example: RequestType.BATHROOM })
  @IsEnum(RequestType)
  requestType: RequestType;

  @ApiPropertyOptional({ example: 0, minimum: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;
}
