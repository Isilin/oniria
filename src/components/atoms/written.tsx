'use client';

import { PropsWithChildren, useState } from 'react';

interface Props {
  /** La valeur écrite : quand elle change, elle se trace à nouveau. */
  value: unknown;
}

/**
 * Une valeur écrite à la plume : quand elle change (saisie, −/+, point
 * ajouté, relecture), elle se trace de gauche à droite (`.oniria-write`,
 * voir le thème). Rien ne bouge au premier affichage ni en mouvement
 * réduit.
 */
const Written = ({ value, children }: PropsWithChildren<Props>) => {
  const [previous, setPrevious] = useState(value);
  const [changed, setChanged] = useState(false);
  if (!Object.is(value, previous)) {
    // Valeur dérivée pendant le rendu (et non dans un effet).
    setPrevious(value);
    setChanged(true);
  }

  return (
    // La clé relance l'animation à chaque nouvelle valeur.
    <span key={String(value)} className={changed ? 'oniria-write' : undefined}>
      {children}
    </span>
  );
};

export default Written;
