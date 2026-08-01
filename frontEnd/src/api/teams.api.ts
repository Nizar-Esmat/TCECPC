import { client } from './client';
import type { TeamDto } from '../types/models';

export async function listTeams(): Promise<TeamDto[]> {
  const res = await client.get<TeamDto[]>('/teams');
  return res.data;
}
