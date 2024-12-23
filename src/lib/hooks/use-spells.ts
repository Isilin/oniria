import { Spell } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import fetcher from '../helpers/swr';

export const useSpells = (sheetId) => {
  const {
    data: spells,
    error,
    isLoading,
  } = useSWR<Spell[]>(`/api/spells?sheet=${sheetId}`, fetcher);

  const { mutate } = useSWRConfig();
  const { trigger: createSpell } = useSWRMutation(
    `/api/spells?sheet=${sheetId}`,
    (url, { arg }: { arg: Partial<Spell> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg || {}),
      }).then((res) => {
        mutate(`/api/spells?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return {
    spells,
    error,
    isLoading,
    createSpell,
  };
};

export const useSpell = (id, sheetId) => {
  const { mutate } = useSWRConfig();

  const { trigger: updateSpell } = useSWRMutation(
    `/api/range-weapons/${id}`,
    (url, { arg }: { arg: Partial<Spell> }) => {
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
      }).then((res) => {
        mutate(`/api/spells?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  const { trigger: deleteSpell } = useSWRMutation(
    `/api/spells/${id}`,
    (url) => {
      return fetch(url, { method: 'DELETE' }).then((res) => {
        mutate(`/api/spells?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return { updateSpell, deleteSpell };
};
