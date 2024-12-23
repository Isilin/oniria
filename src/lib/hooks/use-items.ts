import { Item } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import fetcher from '../helpers/swr';

export const useItems = (sheetId) => {
  const {
    data: items,
    error,
    isLoading,
  } = useSWR<Item[]>(`/api/items?sheet=${sheetId}`, fetcher);

  const { mutate } = useSWRConfig();
  const { trigger: createItem } = useSWRMutation(
    `/api/items?sheet=${sheetId}`,
    (url, { arg }: { arg: Partial<Item> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg || {}),
      }).then((res) => {
        mutate(`/api/items?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return {
    items,
    error,
    isLoading,
    createItem,
  };
};

export const useItem = (id, sheetId) => {
  const { mutate } = useSWRConfig();

  const { trigger: updateItem } = useSWRMutation(
    `/api/items/${id}`,
    (url, { arg }: { arg: Partial<Item> }) => {
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
      }).then((res) => {
        mutate(`/api/items?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  const { trigger: deleteItem } = useSWRMutation(`/api/items/${id}`, (url) => {
    return fetch(url, { method: 'DELETE' }).then((res) => {
      mutate(`/api/items?sheet=${sheetId}`);
      return res.json();
    });
  });

  return { updateItem, deleteItem };
};
