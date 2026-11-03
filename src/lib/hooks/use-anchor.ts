'use client';

import { useSyncExternalStore } from 'react';

const getAnchor = () =>
  Number(decodeURIComponent(window.location.hash.replace('#', '')));

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/**
 * Numéro dans l'URL (#2…). Côté serveur et à l'hydratation, on part de 0 :
 * la page rendue par le serveur correspond au premier rendu du navigateur.
 */
const useAnchor = () => useSyncExternalStore(subscribe, getAnchor, () => 0);

export default useAnchor;
