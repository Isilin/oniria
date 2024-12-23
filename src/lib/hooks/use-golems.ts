import { Golem } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import fetcher from '../helpers/swr';

export const useGolems = (sheetId) => {
  const {
    data: golems,
    error,
    isLoading,
  } = useSWR<Golem[]>(`/api/golems?sheet=${sheetId}`, fetcher);

  const { mutate } = useSWRConfig();
  const { trigger: createGolem } = useSWRMutation(
    `/api/golems?sheet=${sheetId}`,
    (url, { arg }: { arg: Partial<Golem> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg || {}),
      }).then((res) => {
        mutate(`/api/golems?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return {
    golems,
    error,
    isLoading,
    createGolem,
  };
};

export const useGolem = (id, sheetId) => {
  const { mutate } = useSWRConfig();

  const { trigger: updateGolem } = useSWRMutation(
    `/api/golems/${id}`,
    (url, { arg }: { arg: Partial<Golem> }) => {
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
      }).then((res) => {
        mutate(`/api/golems?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  const { trigger: deleteGolem } = useSWRMutation(
    `/api/golems/${id}`,
    (url) => {
      return fetch(url, { method: 'DELETE' }).then((res) => {
        mutate(`/api/golems?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return { updateGolem, deleteGolem };
};
