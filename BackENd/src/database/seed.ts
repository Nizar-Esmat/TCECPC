import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Hall } from '../common/enums/hall.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { TeamsService } from '../modules/teams/teams.service';
import { UsersService } from '../modules/users/users.service';

const VOLUNTEER_NAMES = [
  'Alice Volunteer',
  'Bilal Volunteer',
  'Carla Volunteer',
  'Dara Volunteer',
  'Emeka Volunteer',
  'Farah Volunteer',
  'Gina Volunteer',
  'Hassan Volunteer',
];
const VOLUNTEER_CAPACITIES = [1, 1, 2, 2, 2, 3, 3, 1];
const TEAM_NUMBERS_PER_HALL = [1, 2, 3];
const HALLS = [Hall.HALL_1, Hall.HALL_2, Hall.HALL_3, Hall.HALL_4];

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const dataSource = app.get(DataSource);
    await dataSource.query(
      'TRUNCATE TABLE notifications, request_history, requests, users, teams RESTART IDENTITY CASCADE',
    );

    const usersService = app.get(UsersService);
    const teamsService = app.get(TeamsService);

    const codes: { role: string; name: string; code: string }[] = [];

    const leader = await usersService.create({
      name: 'Competition Leader',
      role: UserRole.LEADER,
    });
    codes.push({ role: 'LEADER', name: leader.name, code: leader.code });

    for (let i = 0; i < VOLUNTEER_NAMES.length; i++) {
      const volunteer = await usersService.create({
        name: VOLUNTEER_NAMES[i],
        role: UserRole.VOLUNTEER,
      });
      await usersService.updateCapacity(volunteer.id, {
        capacity: VOLUNTEER_CAPACITIES[i],
      });
      codes.push({
        role: 'VOLUNTEER',
        name: volunteer.name,
        code: volunteer.code,
      });
    }

    for (const hall of HALLS) {
      for (const teamNumber of TEAM_NUMBERS_PER_HALL) {
        await teamsService.create({ hall, teamNumber });
      }
    }

    console.log(
      '\nSeed complete. Login codes (the only credential — save these):\n',
    );
    console.table(codes);
  } finally {
    await app.close();
  }
}

void seed();
