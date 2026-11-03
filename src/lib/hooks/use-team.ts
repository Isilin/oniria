'use client';

import { useSnackbar } from 'notistack';
import useSWR from 'swr';
import { TeamSummary, TeamWithMembers } from '../db/sheet';
import fetcher, { request } from '../helpers/swr';

export type { TeamSummary, TeamWithMembers };

export const useTeams = () => {
  const {
    data: teams,
    error,
    isLoading,
    mutate,
  } = useSWR<TeamSummary[]>('/api/teams', fetcher);

  const createTeam = async (name: string) => {
    const team = await request<TeamSummary>('POST', '/api/teams', { name });
    await mutate();
    return team;
  };

  return { teams, error, isLoading, createTeam };
};

export const useTeam = (id: string) => {
  const url = `/api/teams/${id}`;
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: team,
    error,
    isLoading,
    mutate,
  } = useSWR<TeamWithMembers>(url, fetcher);

  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await mutate();
      return true;
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: 'error' });
      return false;
    }
  };

  return {
    team,
    error,
    isLoading,
    rename: (name: string) => run(() => request('PATCH', url, { name })),
    addMember: (sheetId: string) =>
      run(() => request('POST', `${url}/members`, { sheetId })),
    removeMember: (sheetId: string) =>
      run(() => request('DELETE', `${url}/members/${sheetId}`)),
    deleteTeam: () => run(() => request('DELETE', url)),
    /** MJ : la même XP à plusieurs personnages de la table. */
    grantXp: (grant: {
      label: string;
      feel: number;
      learn: number;
      live: number;
      sheetIds: string[];
    }) => run(() => request('POST', `${url}/xp`, grant)),
  };
};
