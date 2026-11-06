import { type Amounts, type XpKind, zero } from '@/lib/rules/xp';

/**
 * Le journal de l'expérience d'une fiche, mis en forme pour l'écran et pour
 * l'export PDF : libellé de chaque écriture, montants signés, regroupement
 * des écritures faites ensemble (validation, reset…).
 */

/** Ce dont le journal a besoin d'une écriture (`FullSheet['xpEntries']`). */
export interface JournalEntry {
  id: string;
  kind: XpKind;
  feel: number;
  learn: number;
  live: number;
  offered: number;
  label: string;
  batch: string | null;
  createdAt: Date | string;
  author?: { name: string | null } | null;
}

export const JOURNAL_KINDS: Record<
  XpKind,
  {
    label: string;
    /** Encre de la puce (une couleur de la palette du thème). */
    color: 'success' | 'primary' | 'info' | 'warning' | 'secondary';
  }
> = {
  GAIN: { label: 'Attribution', color: 'success' },
  SPEND: { label: 'Dépense', color: 'primary' },
  REFUND: { label: 'Remboursement', color: 'info' },
  LOSS: { label: 'XP perdue', color: 'warning' },
  GIFT: { label: 'Offert', color: 'secondary' },
};

/** Effet d'une écriture sur l'XP restante. */
export const signedAmounts = (entry: JournalEntry): Amounts => {
  const sign = { GAIN: 1, SPEND: -1, REFUND: 1, LOSS: 0, GIFT: 0 }[entry.kind];
  return {
    feel: sign * entry.feel,
    learn: sign * entry.learn,
    live: sign * entry.live,
  };
};

export const sumAmounts = (amounts: Amounts[]) =>
  amounts.reduce(
    (a, b) => ({
      feel: a.feel + b.feel,
      learn: a.learn + b.learn,
      live: a.live + b.live,
    }),
    zero(),
  );

/** « +10 », « −5 » (vrai signe moins), rien pour 0. */
export const formatSigned = (value: number) =>
  value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '';

const BATCH_TITLES: [string, string][] = [
  ['validation:', 'Validation'],
  ['reset:', 'Reset accordé par le MJ'],
  ['legacy-', 'Reprise de l’ancienne fiche'],
];

/** Titre d'un lot d'écritures faites ensemble. */
export const batchTitle = (entries: JournalEntry[]) =>
  BATCH_TITLES.find(([prefix]) => entries[0].batch?.startsWith(prefix))?.[1] ??
  entries[0].label;

/**
 * Date d'une écriture (« 06/11/2026 »). Le serveur tourne en UTC : l'export
 * passe le fuseau de la table pour qu'une écriture du soir garde sa date.
 */
export const entryDate = (entry: JournalEntry, timeZone?: string) =>
  new Date(entry.createdAt).toLocaleDateString('fr-FR', { timeZone });

/** Précision après le libellé : valeur offerte, XP perdue… */
export const entryDetail = (entry: JournalEntry) => {
  if (entry.kind === 'GIFT') return ` (valeur ${entry.offered} XP)`;
  if (entry.kind === 'LOSS') {
    const lost = entry.feel + entry.learn + entry.live;
    return lost ? ` (${lost} XP perdus)` : '';
  }
  if (entry.offered) return ` (dont ${entry.offered} offerts)`;
  return '';
};

/**
 * Regroupe les écritures faites ensemble (même lot, à la suite), de la plus
 * récente à la plus ancienne.
 */
export const groupEntries = <T extends JournalEntry>(entries: T[]) => {
  const result: T[][] = [];
  for (const entry of [...entries].reverse()) {
    const last = result[result.length - 1];
    if (last && entry.batch && last[0].batch === entry.batch) last.push(entry);
    else result.push([entry]);
  }
  return result;
};
