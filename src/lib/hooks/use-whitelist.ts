'use client';

import { Whitelist } from '@prisma/client';
import { useSnackbar } from 'notistack';
import useSWR from 'swr';
import fetcher, { request } from '../helpers/swr';
import { useNotifyError } from './use-notify-error';

const URL = '/api/whitelist';

/**
 * Whitelist (MJ). Chaque action renvoie `true` si le serveur l'a acceptée ;
 * sinon l'erreur du serveur est affichée et la liste rechargée.
 */
export const useWhitelist = () => {
  const { enqueueSnackbar } = useSnackbar();
  const notifyError = useNotifyError();
  const {
    data: whitelist,
    error,
    isLoading,
    mutate,
  } = useSWR<Whitelist[]>(URL, fetcher);

  const run = async (fn: () => Promise<unknown>, success: string) => {
    try {
      await fn();
      await mutate();
      enqueueSnackbar(success, { variant: 'info' });
      return true;
    } catch (e) {
      notifyError(e);
      await mutate();
      return false;
    }
  };

  return {
    whitelist,
    error,
    isLoading,
    retry: () => mutate(),
    addToWhitelist: (email: string) =>
      run(
        () => request('POST', URL, { email }),
        `${email.trim().toLowerCase()} ajoutée à la whitelist.`,
      ),
    updateEmail: (id: string, email: string) =>
      run(
        () => request('PATCH', `${URL}/${id}`, { email }),
        'Adresse corrigée.',
      ),
    deleteFromWhitelist: (entry: Whitelist) =>
      run(
        () => request('DELETE', `${URL}/${entry.id}`),
        `${entry.email} retirée de la whitelist.`,
      ),
  };
};
