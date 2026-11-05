'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from '@mui/material';
import { signIn } from 'next-auth/react';
import { closeSnackbar, SnackbarKey, useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { RequestError } from '../helpers/swr';

/** Session expirée : le billet propose de se reconnecter, puis de revenir ici. */
const reconnect = (key: SnackbarKey) => (
  <>
    <Button
      color="inherit"
      size="small"
      onClick={() => signIn('google', { callbackUrl: window.location.href })}
    >
      Se reconnecter
    </Button>
    <IconButton
      aria-label="Fermer"
      color="inherit"
      size="small"
      onClick={() => closeSnackbar(key)}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </>
);

/** Le message d'une erreur, quelle qu'elle soit. */
export const messageOf = (e: unknown) =>
  e instanceof Error && e.message ? e.message : 'Erreur inconnue.';

/**
 * Affiche une erreur dans un billet qui reste jusqu'à ce qu'on le ferme : le
 * temps de le lire, même en pleine partie. Une session expirée propose de se
 * reconnecter.
 */
export const useNotifyError = () => {
  const { enqueueSnackbar } = useSnackbar();
  return useCallback(
    (e: unknown) => {
      const expired = e instanceof RequestError && e.status === 401;
      enqueueSnackbar(messageOf(e), {
        variant: 'error',
        persist: true,
        ...(expired && { action: reconnect }),
      });
    },
    [enqueueSnackbar],
  );
};
