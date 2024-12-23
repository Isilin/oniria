import { Armor } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { ArmorWithProperties } from '../db/sheet';
import fetcher from '../helpers/swr';

export const useArmors = (sheetId) => {
  const {
    data: armors,
    error,
    isLoading,
  } = useSWR<ArmorWithProperties[]>(`/api/armors?sheet=${sheetId}`, fetcher);

  const { mutate } = useSWRConfig();
  const { trigger: createArmor } = useSWRMutation(
    `/api/armors?sheet=${sheetId}`,
    (url, { arg }: { arg: Partial<Armor> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg || {}),
      }).then((res) => {
        mutate(`/api/armors?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return {
    armors,
    error,
    isLoading,
    createArmor,
  };
};

export const useArmor = (id, sheetId) => {
  const { mutate } = useSWRConfig();

  const { trigger: updateArmor } = useSWRMutation(
    `/api/armors/${id}`,
    (url, { arg }: { arg: Partial<ArmorWithProperties> }) => {
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
      }).then((res) => {
        mutate(`/api/armors?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  const { trigger: deleteArmor } = useSWRMutation(
    `/api/armors/${id}`,
    (url) => {
      return fetch(url, { method: 'DELETE' }).then((res) => {
        mutate(`/api/armors?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return { updateArmor, deleteArmor };
};
