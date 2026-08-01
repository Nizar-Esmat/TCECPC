import { create } from 'zustand';
import * as usersApi from '../api/users.api';
import type { CreateUserPayload } from '../api/users.api';
import type { UserDto } from '../types/models';
import type { VolunteerStatus } from '../types/enums';

interface UsersState {
  users: UserDto[];
  loading: boolean;
  error: string | null;
  lastCreatedCode: string | null;
  fetch: () => Promise<void>;
  create: (payload: CreateUserPayload) => Promise<UserDto>;
  updateStatus: (id: string, status: VolunteerStatus) => Promise<void>;
  updateCapacity: (id: string, capacity: number) => Promise<void>;
  patchOne: (user: UserDto) => void;
  clearLastCreatedCode: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  lastCreatedCode: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const users = await usersApi.listUsers();
      set({ users, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load users',
      });
    }
  },

  create: async (payload) => {
    const created = await usersApi.createUser(payload);
    set({ users: [...get().users, created], lastCreatedCode: created.code });
    return created;
  },

  updateStatus: async (id, status) => {
    const updated = await usersApi.updateUserStatus(id, status);
    get().patchOne(updated);
  },

  updateCapacity: async (id, capacity) => {
    const updated = await usersApi.updateUserCapacity(id, capacity);
    get().patchOne(updated);
  },

  patchOne: (user) => {
    set({
      users: get().users.map((u) => (u.id === user.id ? user : u)),
    });
  },

  clearLastCreatedCode: () => set({ lastCreatedCode: null }),
}));
