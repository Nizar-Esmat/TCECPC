import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Hall } from '../../common/enums/hall.enum';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindTeamsQueryDto } from './dto/find-teams-query.dto';
import {
  ImportTeamsResponseDto,
  SkippedTeamDto,
} from './dto/import-teams-response.dto';
import { ImportTeamsDto } from './dto/import-teams.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
  ) {}

  async create(dto: CreateTeamDto): Promise<TeamResponseDto> {
    const saved = await this.tryInsert(dto.hall, dto.teamNumber);
    if (!saved) {
      throw new ConflictException(
        `Team ${dto.hall} #${dto.teamNumber} already exists`,
      );
    }
    return new TeamResponseDto(saved);
  }

  async importTeams(dto: ImportTeamsDto): Promise<ImportTeamsResponseDto> {
    const created: TeamResponseDto[] = [];
    const skipped: SkippedTeamDto[] = [];

    for (const item of dto.teams) {
      const saved = await this.tryInsert(item.hall, item.teamNumber);
      if (saved) {
        created.push(new TeamResponseDto(saved));
      } else {
        skipped.push({
          hall: item.hall,
          teamNumber: item.teamNumber,
          reason: 'Already exists',
        });
      }
    }

    return { created, skipped };
  }

  async findAll(query: FindTeamsQueryDto): Promise<TeamResponseDto[]> {
    const where: Partial<Pick<Team, 'hall' | 'teamNumber'>> = {};
    if (query.hall) where.hall = query.hall;
    if (query.teamNumber !== undefined) where.teamNumber = query.teamNumber;

    const teams = await this.teamsRepository.find({
      where,
      order: { hall: 'ASC', teamNumber: 'ASC' },
    });
    return teams.map((team) => new TeamResponseDto(team));
  }

  async findOne(id: string): Promise<TeamResponseDto> {
    const team = await this.findEntityOrThrow(id);
    return new TeamResponseDto(team);
  }

  async update(id: string, dto: UpdateTeamDto): Promise<TeamResponseDto> {
    const team = await this.findEntityOrThrow(id);
    if (dto.hall !== undefined) team.hall = dto.hall;
    if (dto.teamNumber !== undefined) team.teamNumber = dto.teamNumber;

    try {
      const saved = await this.teamsRepository.save(team);
      return new TeamResponseDto(saved);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(
          `Team ${team.hall} #${team.teamNumber} already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<null> {
    const team = await this.findEntityOrThrow(id);
    await this.teamsRepository.remove(team);
    return null;
  }

  private async tryInsert(
    hall: Hall,
    teamNumber: number,
  ): Promise<Team | null> {
    const team = this.teamsRepository.create({ hall, teamNumber });
    try {
      return await this.teamsRepository.save(team);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        return null;
      }
      throw error;
    }
  }

  private async findEntityOrThrow(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return team;
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as unknown as { code?: string }).code === '23505'
    );
  }
}
