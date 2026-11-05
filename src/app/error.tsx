'use client';

import ErrorNotice from '@/components/organisms/error-notice';
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
    >
      Le serveur n&apos;a pas répondu. Réessaie dans un instant{'\u00a0'}; si ça
      recommence, préviens le MJ.
    </ErrorNotice>
  );
};

export default PageError;
