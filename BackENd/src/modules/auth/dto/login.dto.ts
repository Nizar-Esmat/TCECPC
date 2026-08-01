import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'VOL-042' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
