import { RangeWeapon } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { RangeWeaponWithProperties } from '../db/sheet';
import fetcher from '../helpers/swr';

export const useRangeWeapons = (sheetId) => {
  const {
    data: rangeWeapons,
    error,
    isLoading,
  } = useSWR<RangeWeaponWithProperties[]>(
    `/api/range-weapons?sheet=${sheetId}`,
    fetcher,
  );

  const { mutate } = useSWRConfig();
  const { trigger: createRangeWeapon } = useSWRMutation(
    `/api/range-weapons?sheet=${sheetId}`,
    (url, { arg }: { arg: Partial<RangeWeapon> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg || {}),
      }).then((res) => {
        mutate(`/api/range-weapons?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return {
    rangeWeapons,
    error,
    isLoading,
    createRangeWeapon,
  };
};

export const useRangeWeapon = (id, sheetId) => {
  const { mutate } = useSWRConfig();

  const { trigger: updateRangeWeapon } = useSWRMutation(
    `/api/range-weapons/${id}`,
    (url, { arg }: { arg: Partial<RangeWeaponWithProperties> }) => {
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
      }).then((res) => {
        mutate(`/api/range-weapons?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  const { trigger: deleteRangeWeapon } = useSWRMutation(
    `/api/range-weapons/${id}`,
    (url) => {
      return fetch(url, { method: 'DELETE' }).then((res) => {
        mutate(`/api/range-weapons?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return { updateRangeWeapon, deleteRangeWeapon };
};
