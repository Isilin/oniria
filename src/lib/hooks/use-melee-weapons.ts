import { MeleeWeapon } from '@prisma/client';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { MeleeWeaponWithProperties } from '../db/sheet';
import fetcher from '../helpers/swr';

export const useMeleeWeapons = (sheetId) => {
  const {
    data: meleeWeapons,
    error,
    isLoading,
  } = useSWR<MeleeWeaponWithProperties[]>(
    `/api/melee-weapons?sheet=${sheetId}`,
    fetcher,
  );

  const { mutate } = useSWRConfig();
  const { trigger: createMeleeWeapon } = useSWRMutation(
    `/api/melee-weapons?sheet=${sheetId}`,
    (url, { arg }: { arg: Partial<MeleeWeapon> }) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg || {}),
      }).then((res) => {
        mutate(`/api/melee-weapons?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return {
    meleeWeapons,
    error,
    isLoading,
    createMeleeWeapon,
  };
};

export const useMeleeWeapon = (id, sheetId) => {
  const { mutate } = useSWRConfig();

  const { trigger: updateMeleeWeapon } = useSWRMutation(
    `/api/melee-weapons/${id}`,
    (url, { arg }: { arg: Partial<MeleeWeaponWithProperties> }) => {
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(arg),
      }).then((res) => {
        mutate(`/api/melee-weapons?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  const { trigger: deleteMeleeWeapon } = useSWRMutation(
    `/api/melee-weapons/${id}`,
    (url) => {
      return fetch(url, { method: 'DELETE' }).then((res) => {
        mutate(`/api/melee-weapons?sheet=${sheetId}`);
        return res.json();
      });
    },
  );

  return { updateMeleeWeapon, deleteMeleeWeapon };
};
