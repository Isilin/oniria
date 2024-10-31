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
  } = useSWR<Team[]>('/api/teams', fetcher);

  const { trigger: createTeam } = useSWRMutation(
    '/api/teams',
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
  } = useSWR<TeamWithMembers>(`/api/teams/${id}`, fetcher);

  const { trigger: deleteTeam } = useSWRMutation(`/api/teams/${id}`, (url) => {
    return fetch(url, {
      method: 'DELETE',
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

export const useTeamMembers = (teamId, memberId) => {
  const { mutate } = useSWRConfig();

  const { trigger: deleteFromTeam } = useSWRMutation(
    `/api/teams/${teamId}/members/${memberId}`,
    (url) => {
      return fetch(url, {
        method: 'PATCH',
      }).then((res) => {
        mutate(`/api/team/${teamId}`);
        return res.json();
      });
    },
  );

  return {
    deleteFromTeam,
  };
};
