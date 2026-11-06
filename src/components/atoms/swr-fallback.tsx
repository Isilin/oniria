'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { SWRConfig, useSWRConfig } from 'swr';

interface Props {
  /** Données déjà lues par le serveur, par adresse d'API (`/api/sheets/…`). */
  fallback: Record<string, unknown>;
}

/**
 * Affiche tout de suite les données envoyées avec la page, sans attendre
 * l'appel à l'API.
 *
 * Elles viennent d'être lues : inutile de les redemander à l'affichage, ni à
 * chaque ouverture d'onglet (`revalidateIfStale: false`). Si l'appli les avait
 * déjà en mémoire (retour sur une fiche), c'est cette copie qui s'affiche :
 * on la relit alors une fois, pour voir les changements faits entre-temps.
 * Revenir sur l'onglet du navigateur relit toujours les données.
 */
const SWRFallback = ({ fallback, children }: PropsWithChildren<Props>) => {
  const { cache, mutate } = useSWRConfig();
  const [cached] = useState(() =>
    Object.keys(fallback).filter((key) => cache.get(key)?.data !== undefined),
  );

  useEffect(() => {
    cached.forEach((key) => mutate(key));
  }, [cached, mutate]);

  return (
    <SWRConfig value={{ fallback, revalidateIfStale: false }}>
      {children}
    </SWRConfig>
  );
};

export default SWRFallback;
