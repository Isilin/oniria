/**
 * Éléments rayés.
 *
 * Le MJ peut rayer un élément de la fiche (trait, aspect du Corpus,
 * potentiel, compétence, équipement…) au lieu de le supprimer : il reste sur
 * la fiche, barré, et n'a plus aucun effet (bonus, prérequis, balance,
 * protection…). L'XP payée pour lui est perdue : une écriture « XP perdue »
 * au journal, et sa valeur gardée sur l'élément (`lostXp`). Le MJ peut le
 * rétablir : offert, ou racheté avec l'XP du personnage.
 *
 * Les points de caractéristique rayés (une baisse du MJ sans remboursement)
 * sont comptés par caractéristique dans `lostPoints`. La rature reste quand
 * des points sont rachetés ; seul le MJ l'efface, en rétablissant les points.
 *
 * Fonctions pures, partagées entre le client et le serveur.
 */

import { CHARACTERISTICS, CharacteristicKey } from '.';

export interface Strikable {
  lostAt?: Date | string | null;
}

export const isLost = (item: Strikable) => !!item.lostAt;

/** Les éléments encore actifs (non rayés). */
export const activeOnly = <T extends Strikable>(items: T[] | undefined) =>
  (items ?? []).filter((item) => !isLost(item));

export type LostPoints = Partial<Record<CharacteristicKey, number>>;

/** Lit `lostPoints` tel qu'enregistré (JSON) : seuls les entiers positifs. */
export const lostPointsOf = (raw: unknown): LostPoints => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const record = raw as Record<string, unknown>;
  const result: LostPoints = {};
  for (const c of CHARACTERISTICS) {
    const value = record[c.key];
    if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
      result[c.key] = value;
    }
  }
  return result;
};

/** Ajoute des points rayés (baisse du MJ sans remboursement). */
export const addLostPoints = (
  current: LostPoints,
  added: LostPoints,
): LostPoints => {
  const result: LostPoints = { ...current };
  for (const c of CHARACTERISTICS) {
    const value = (result[c.key] ?? 0) + Math.max(0, added[c.key] ?? 0);
    if (value > 0) result[c.key] = value;
  }
  return result;
};

/** Efface la rature de ces caractéristiques (points rétablis par le MJ). */
export const clearLostPoints = (
  current: LostPoints,
  keys: CharacteristicKey[],
): LostPoints =>
  Object.fromEntries(
    Object.entries(current).filter(
      ([key]) => !keys.includes(key as CharacteristicKey),
    ),
  ) as LostPoints;
