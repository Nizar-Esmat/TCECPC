import { client } from './client';
import type { UserDto } from '../types/models';
import type { UserRole, VolunteerStatus } from '../types/enums';

export interface CreateUserPayload {
  name: string;
  role: UserRole;
}

export async function listUsers(): Promise<UserDto[]> {
  return (await client.get<UserDto[]>('/users')).data;
}

export async function createUser(payload: CreateUserPayload): Promise<UserDto> {
  return (await client.post<UserDto>('/users', payload)).data;
}

export async function updateUserStatus(id: string, status: VolunteerStatus): Promise<UserDto> {
  return (await client.patch<UserDto>(`/users/${id}/status`, { status })).data;
}

export async function updateUserCapacity(id: string, capacity: number): Promise<UserDto> {
  return (await client.patch<UserDto>(`/users/${id}/capacity`, { capacity })).data;
}
