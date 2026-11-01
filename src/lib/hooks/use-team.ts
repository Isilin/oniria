'use client';

import { Prisma } from '@prisma/client';
import { useSnackbar } from 'notistack';
import useSWR from 'swr';
import { SHEET_INCLUDE } from '../db/sheet';
import fetcher, { request } from '../helpers/swr';

export type TeamSummary = Prisma.TeamGetPayload<{
  include: { members: { select: { id: true; name: true } } };
}>;

export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: { members: { include: typeof SHEET_INCLUDE } };
}>;

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
  };
};
