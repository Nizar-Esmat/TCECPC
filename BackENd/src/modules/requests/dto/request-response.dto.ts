import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../../../common/enums/request-status.enum';
import { RequestType } from '../../../common/enums/request-type.enum';
import { TeamResponseDto } from '../../teams/dto/team-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { Request } from '../entities/request.entity';

export class RequestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: TeamResponseDto })
  team: TeamResponseDto;

  @ApiProperty({ type: UserResponseDto, nullable: true })
  volunteer: UserResponseDto | null;

  @ApiProperty({ enum: RequestType })
  requestType: RequestType;

  @ApiProperty({ enum: RequestStatus })
  status: RequestStatus;

  @ApiProperty()
  priority: number;

  @ApiProperty({ nullable: true })
  assignedAt: Date | null;

  @ApiProperty({ nullable: true })
  pickedUpAt: Date | null;

  @ApiProperty({ nullable: true })
  completedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(request: Request) {
    this.id = request.id;
    this.team = new TeamResponseDto(request.team);
    this.volunteer = request.volunteer
      ? new UserResponseDto(request.volunteer)
      : null;
    this.requestType = request.requestType;
    this.status = request.status;
    this.priority = request.priority;
    this.assignedAt = request.assignedAt;
    this.pickedUpAt = request.pickedUpAt;
    this.completedAt = request.completedAt;
    this.createdAt = request.createdAt;
    this.updatedAt = request.updatedAt;
  }
}
