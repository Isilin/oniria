'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import fetcher, { request } from '../helpers/swr';
import { Preferences, SectionKey } from '../preferences';
import { useNotifyError } from './use-notify-error';

const URL = '/api/me/preferences';

/**
 * Réglages du compte connecté. Chaque changement s'affiche tout de suite et
 * s'enregistre en arrière-plan ; en cas d'échec, l'affichage est rétabli.
 */
export const usePreferences = () => {
  const { status } = useSession();
  const notifyError = useNotifyError();
  const { data, mutate } = useSWR<Preferences>(
    status === 'authenticated' ? URL : null,
    fetcher,
    { revalidateOnFocus: false },
  );
  const preferences = data ?? {};

  const save = async (patch: Preferences) => {
    try {
      await mutate(request<Preferences>('PATCH', URL, patch), {
        optimisticData: { ...preferences, ...patch },
        rollbackOnError: true,
        revalidate: false,
      });
    } catch (e) {
      notifyError(e);
    }
  };

  const collapsed = new Set(preferences.collapsed ?? []);

  return {
    preferences,
    loaded: data !== undefined,
    save,
    isCollapsed: (key: SectionKey) => collapsed.has(key),
    toggleSection: (key: SectionKey) => {
      const next = new Set(collapsed);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return save({ collapsed: [...next] });
    },
  };
};
