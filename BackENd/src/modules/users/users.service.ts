import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { QueryFailedError, Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { VolunteerStatus } from '../../common/enums/volunteer-status.enum';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AssignmentService } from '../assignment/assignment.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

const CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous 0/O/1/I
const CODE_SUFFIX_LENGTH = 6;
const CODE_GENERATION_MAX_ATTEMPTS = 5;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly assignmentService: AssignmentService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const prefix = dto.role === UserRole.LEADER ? 'LDR' : 'VOL';

    for (let attempt = 1; attempt <= CODE_GENERATION_MAX_ATTEMPTS; attempt++) {
      const code = `${prefix}-${this.randomSuffix()}`;
      const user = this.usersRepository.create({
        code,
        name: dto.name,
        role: dto.role,
      });

      try {
        const saved = await this.usersRepository.save(user);
        return new UserResponseDto(saved);
      } catch (error) {
        if (this.isUniqueViolation(error)) {
          continue;
        }
        throw error;
      }
    }

    throw new InternalServerErrorException(
      'Failed to generate a unique user code, please try again',
    );
  }

  async findAll(query: FindUsersQueryDto): Promise<UserResponseDto[]> {
    const where: Partial<Pick<User, 'role' | 'status'>> = {};
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;

    const users = await this.usersRepository.find({
      where,
      order: { createdAt: 'ASC' },
    });
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.findEntityOrThrow(id);
    return new UserResponseDto(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findEntityOrThrow(id);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.role !== undefined) user.role = dto.role;
    const saved = await this.usersRepository.save(user);
    return new UserResponseDto(saved);
  }

  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
    requester: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    if (requester.role !== UserRole.LEADER && requester.id !== id) {
      throw new ForbiddenException('You can only update your own status');
    }
    const user = await this.findEntityOrThrow(id);
    user.status = dto.status;
    if (dto.status === VolunteerStatus.AVAILABLE) {
      user.availableSince = new Date();
    }
    const saved = await this.usersRepository.save(user);

    if (dto.status === VolunteerStatus.OFFLINE) {
      await this.assignmentService.reassignAllForVolunteer(id);
    } else if (dto.status === VolunteerStatus.AVAILABLE) {
      await this.assignmentService.resyncAndSweep(id);
    }

    return new UserResponseDto(saved);
  }

  async updateCapacity(
    id: string,
    dto: UpdateCapacityDto,
  ): Promise<UserResponseDto> {
    const user = await this.findEntityOrThrow(id);
    user.capacity = dto.capacity;
    const saved = await this.usersRepository.save(user);
    await this.assignmentService.resyncAndSweep(id);
    return new UserResponseDto(saved);
  }

  async remove(id: string): Promise<null> {
    const user = await this.findEntityOrThrow(id);
    await this.usersRepository.remove(user);
    return null;
  }

  private async findEntityOrThrow(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  private randomSuffix(): string {
    const bytes = randomBytes(CODE_SUFFIX_LENGTH);
    let result = '';
    for (let i = 0; i < CODE_SUFFIX_LENGTH; i++) {
      result += CODE_CHARSET[bytes[i] % CODE_CHARSET.length];
    }
    return result;
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error as unknown as { code?: string }).code === '23505'
    );
  }
}
