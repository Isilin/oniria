'use client';

import { PropsWithChildren, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  /** `start` : avant le nom du jeu (retour) ; `end` : après l'affichage (⋯). */
  side: 'start' | 'end';
}

// L'emplacement fait partie de la barre du haut, rendue avant la page : rien
// à écouter, il suffit de le lire une fois hydraté.
const subscribe = () => () => {};

/**
 * Place un contrôle de la page dans la barre du haut : une seule barre fine
 * (retour, ONIRIA, affichage, ⋯) au lieu d'une ligne de plus sous elle.
 */
const HeaderSlot = ({ side, children }: PropsWithChildren<Props>) => {
  const target = useSyncExternalStore(
    subscribe,
    () => document.getElementById(`header-${side}`),
    () => null,
  );

  return target ? createPortal(children, target) : null;
};

export default HeaderSlot;
