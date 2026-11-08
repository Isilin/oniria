'use client';

import { CharacteristicKey } from '@/lib/rules';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/** Valeurs visées des caractères, avant validation. */
export type PointsDraft = Partial<Record<CharacteristicKey, number>>;

export const EMPTY_DRAFT: PointsDraft = {};

interface PointsDraftState {
  draft: PointsDraft;
  setDraft: Dispatch<SetStateAction<PointsDraft>>;
}

const PointsDraftContext = createContext<PointsDraftState | null>(null);

/** Points en attente de la fiche affichée (null hors d'une fiche). */
export const usePointsDraft = () => useContext(PointsDraftContext);

/**
 * Garde les points ajoutés aux caractères jusqu'à leur validation, pour
 * toutes les cartes de la fiche (et d'un onglet à l'autre). Quitter la page
 * avec des points en attente demande confirmation.
 */
export const PointsDraftProvider = ({ children }: PropsWithChildren) => {
  const [draft, setDraft] = useState<PointsDraft>(EMPTY_DRAFT);
  const pending = Object.keys(draft).length > 0;

  useEffect(() => {
    if (!pending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [pending]);

  const value = useMemo(() => ({ draft, setDraft }), [draft]);
  return (
    <PointsDraftContext.Provider value={value}>
      {children}
    </PointsDraftContext.Provider>
  );
};
