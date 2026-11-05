'use client';

import { RequestError } from '@/lib/helpers/swr';
import { messageOf } from '@/lib/hooks/use-notify-error';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  /** Ce qui n'a pas pu être lu (« Les fiches n'ont pas pu être lues. »). */
  what: string;
  error?: unknown;
  /** Relit les données ; sans elle, pas de bouton « Réessayer ». */
  onRetry?: () => unknown;
}

/**
 * Une lecture qui a échoué : ce qui manque, pourquoi, et la seule action
 * utile. Introuvable ou interdit : retour à l'accueil, puisque réessayer n'y
 * changerait rien ; session expirée : se reconnecter ; sinon, réessayer.
 */
const LoadError = ({ what, error, onRetry }: Props) => {
  const status = error instanceof RequestError ? error.status : null;
  // Le bouton suit la phrase, sur une ligne, et passe dessous à droite quand
  // la place manque (téléphone), comme dans le rappel de création.
  const button = { ml: 'auto', whiteSpace: 'nowrap' } as const;
  const action =
    status === 401 ? (
      <Button
        color="inherit"
        size="small"
        sx={button}
        onClick={() => signIn('google', { callbackUrl: window.location.href })}
      >
        Se reconnecter
      </Button>
    ) : status === 403 || status === 404 ? (
      <Button
        component={Link}
        href="/"
        color="inherit"
        size="small"
        sx={button}
      >
        Retour à l&apos;accueil
      </Button>
    ) : onRetry ? (
      <Button
        color="inherit"
        size="small"
        sx={button}
        onClick={() => onRetry()}
      >
        Réessayer
      </Button>
    ) : null;

  return (
    <Alert
      severity="error"
      role="alert"
      sx={{
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        '& .MuiAlert-message': { flex: 1, minWidth: 0 },
      }}
    >
      <AlertTitle>{what}</AlertTitle>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 2,
          rowGap: 0.5,
        }}
      >
        {error ? <span>{messageOf(error)}</span> : null}
        {action}
      </Box>
    </Alert>
  );
};

export default LoadError;
