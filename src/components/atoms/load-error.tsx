'use client';

import { RequestError } from '@/lib/helpers/swr';
import { messageOf } from '@/lib/hooks/use-notify-error';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
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
  const action =
    status === 401 ? (
      <Button
        color="inherit"
        size="small"
        onClick={() => signIn('google', { callbackUrl: window.location.href })}
      >
        Se reconnecter
      </Button>
    ) : status === 403 || status === 404 ? (
      <Button component={Link} href="/" color="inherit" size="small">
        Retour à l&apos;accueil
      </Button>
    ) : onRetry ? (
      <Button color="inherit" size="small" onClick={() => onRetry()}>
        Réessayer
      </Button>
    ) : null;

  return (
    <Alert
      severity="error"
      role="alert"
      action={action}
      sx={{
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        '& .MuiAlert-action': { alignItems: 'center', pt: 0 },
      }}
    >
      <AlertTitle>{what}</AlertTitle>
      {error ? messageOf(error) : null}
    </Alert>
  );
};

export default LoadError;
