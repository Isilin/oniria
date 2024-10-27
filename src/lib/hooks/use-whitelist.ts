import { Whitelist } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import fetcher from '../helpers/swr';

export const useWhitelist = () => {
  const {
    data: whitelist,
    error,
    isLoading,
  } = useSWR<Whitelist[]>('/api/whitelist', fetcher);

  const { trigger: addToWhitelist } = useSWRMutation(
    '/api/whitelist',
    (url, { arg }: { arg: Partial<Whitelist> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      });
    },
  );

  return {
    whitelist,
    error,
    isLoading,
    addToWhitelist,
  };
};

export const useWhitelistEmail = (id) => {
  const { mutate } = useSWRConfig();
  const { trigger: deleteFromWhitelist } = useSWRMutation(
    `/api/whitelist/${id}`,
    (url) => {
      return fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({
          id,
        }),
      }).then((res) => {
        mutate('/api/whitelist');
        return res.json();
      });
    },
  );

  return {
    deleteFromWhitelist,
  };
};
