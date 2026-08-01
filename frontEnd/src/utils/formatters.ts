import { formatDistanceToNow } from 'date-fns';
import type { Hall, RequestType } from '../types/enums';

export function timeAgo(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatHall(hall: Hall): string {
  return hall.replace('HALL_', 'Hall ');
}

export function formatRequestType(type: RequestType): string {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export function formatTeam(hall: Hall, teamNumber: number): string {
  return `${formatHall(hall)} · Team ${teamNumber}`;
}
