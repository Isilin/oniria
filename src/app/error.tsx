'use client';

import ErrorNotice from '@/components/organisms/error-notice';
import { SERVER_DOWN } from '@/lib/helpers/swr';
import { useEffect } from 'react';

/**
 * Une page qui n'a pas pu s'afficher (base qui ne répond pas, erreur du
 * serveur), dans le carnet : le bandeau et le pied restent en place.
 */
const PageError = ({ error, retry }: { error: unknown; retry: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && 'digest' in error
      ? String(error.digest)
      : undefined;

  return (
    <ErrorNotice
      title="La page n'a pas pu s'afficher"
      onRetry={retry}
      digest={digest}
      alert
    >
      {SERVER_DOWN}
    </ErrorNotice>
  );
};

export default PageError;
