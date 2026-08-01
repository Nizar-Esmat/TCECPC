import type {
  Hall,
  NotificationType,
  RequestStatus,
  RequestType,
  UserRole,
  VolunteerStatus,
} from './enums';

export interface TeamDto {
  id: string;
  hall: Hall;
  teamNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserDto {
  id: string;
  code: string;
  name: string;
  role: UserRole;
  status: VolunteerStatus;
  capacity: number;
  availableSince: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestDto {
  id: string;
  team: TeamDto;
  volunteer: UserDto | null;
  requestType: RequestType;
  status: RequestStatus;
  priority: number;
  assignedAt: string | null;
  pickedUpAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDto {
  id: string;
  type: NotificationType;
  message: string;
  requestId: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface RequestCounts {
  waiting: number;
  assigned: number;
  pickedUp: number;
  completed: number;
  cancelled: number;
  total: number;
}

export interface VolunteerCounts {
  available: number;
  busy: number;
  offline: number;
  total: number;
}

export interface HallBreakdown {
  hall: Hall;
  waitingCount: number;
  activeCount: number;
}

export interface DashboardOverviewDto {
  requests: RequestCounts;
  volunteers: VolunteerCounts;
  teamCount: number;
  perHall: HallBreakdown[];
}

export interface AssignmentAttemptDto {
  requestId: string;
  assigned: boolean;
  volunteerId?: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: UserDto;
}

export interface ApiErrorPayload {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
}
