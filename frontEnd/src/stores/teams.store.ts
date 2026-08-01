import { create } from 'zustand';
import * as teamsApi from '../api/teams.api';
import type { TeamDto } from '../types/models';

interface TeamsState {
  teams: TeamDto[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useTeamsStore = create<TeamsState>((set) => ({
  teams: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const teams = await teamsApi.listTeams();
      set({ teams, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load teams',
      });
    }
  },
}));
