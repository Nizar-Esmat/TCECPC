import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindTeamsQueryDto } from './dto/find-teams-query.dto';
import { ImportTeamsResponseDto } from './dto/import-teams-response.dto';
import { ImportTeamsDto } from './dto/import-teams.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@ApiTags('teams')
@ApiBearerAuth('access-token')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER)
  @ApiOperation({ summary: 'Create a team (Leader only)' })
  create(@Body() dto: CreateTeamDto): Promise<TeamResponseDto> {
    return this.teamsService.create(dto);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER)
  @ApiOperation({
    summary:
      'Bulk-import teams, skipping ones that already exist (Leader only)',
  })
  importTeams(@Body() dto: ImportTeamsDto): Promise<ImportTeamsResponseDto> {
    return this.teamsService.importTeams(dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'List/search teams, optionally filtered by hall/teamNumber (open — no login required, used by the public request form)',
  })
  findAll(@Query() query: FindTeamsQueryDto): Promise<TeamResponseDto[]> {
    return this.teamsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single team by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TeamResponseDto> {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER)
  @ApiOperation({ summary: 'Update a team (Leader only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeamDto,
  ): Promise<TeamResponseDto> {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER)
  @ApiOperation({ summary: 'Delete a team (Leader only)' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<null> {
    return this.teamsService.remove(id);
  }
}
