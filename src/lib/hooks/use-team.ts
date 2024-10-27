import { Team } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { TeamWithMembers } from '../db/team';
import fetcher from '../helpers/swr';

export const useTeams = () => {
  const {
    data: teams,
    error,
    isLoading,
  } = useSWR<Team[]>('/api/team', fetcher);

  const { trigger: createTeam } = useSWRMutation(
    '/api/team',
    (url, { arg }: { arg: Partial<Team> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      });
    },
  );

  return {
    teams,
    error,
    isLoading,
    createTeam,
  };
};

export const useTeam = (id) => {
  const { mutate } = useSWRConfig();

  const {
    data: team,
    error,
    isLoading,
  } = useSWR<TeamWithMembers>(`/api/team/${id}`, fetcher);

  const { trigger: deleteTeam } = useSWRMutation(`/api/team/${id}`, (url) => {
    return fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({
        id,
      }),
    }).then((res) => {
      mutate('/api/team');
      return res.json();
    });
  });

  return {
    team,
    error,
    isLoading,
    deleteTeam,
  };
};
