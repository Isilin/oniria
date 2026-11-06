import {
  CHARACTERISTICS,
  type CharacteristicValues,
  meetsPrerequisite,
  normalizeStat,
} from '@/lib/rules';
import {
  ALL_SCOPES,
  type Amounts,
  POOLS,
  type XpSummary,
} from '@/lib/rules/xp';
import type { SKILL_DEGREES, SKILL_TYPES } from './fields';

/**
 * Libellés et petites mises en forme de la fiche, partagés par l'écran et
 * l'export PDF (qui ne peut pas importer les composants client).
 */

/** Texte « Éprouver 10 · Vivre 5 » d'un montant. */
// Espaces insécables : un montant reste collé à sa catégorie (« Vivre 160 »)
// et le point médian ne commence jamais une ligne.
export const formatAmounts = (amounts: Amounts, empty = '0') =>
  POOLS.filter((p) => amounts[p.key])
    .map((p) => `${p.label} ${amounts[p.key]}`)
    .join(' · ') || empty;

/* -------------------------------------------------------------------------- */
/*                                 Compétences                                */
/* -------------------------------------------------------------------------- */

export type SkillType = (typeof SKILL_TYPES)[number];
export type SkillDegree = (typeof SKILL_DEGREES)[number];

export const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  GENERAL: 'Générales',
  SPYRAL: 'Spyrales',
  MARTIAL: 'Martiales',
};

export const DEGREE_LABELS: Record<SkillDegree, string> = {
  BASE: 'Base',
  PRINCIPLE: 'Principe',
  MASTERY: 'Maîtrise',
  TECHNIQUE: 'Technique',
  SEQUENCE: 'Enchaînement',
};

/** Encre de la puce de degré (une couleur de la palette du thème). */
export const DEGREE_COLORS: Record<
  SkillDegree,
  'primary' | 'secondary' | 'success' | 'warning'
> = {
  BASE: 'primary',
  PRINCIPLE: 'secondary',
  MASTERY: 'success',
  TECHNIQUE: 'success',
  SEQUENCE: 'warning',
};

/* -------------------------------------------------------------------------- */
/*                                   Schémas                                  */
/* -------------------------------------------------------------------------- */

/** Ce que peut renforcer un aspect du Corpus : un caractère, ou la Santé. */
export const CORPUS_STAT_OPTIONS = [
  ...CHARACTERISTICS.map((c) => ({ value: c.key as string, label: c.label })),
  { value: 'health', label: 'Santé' },
];

/** Libellé du caractère renforcé par un aspect du Corpus (« - » sans bonus). */
export const corpusStatLabel = (stat: string | null | undefined) => {
  const key = normalizeStat(stat);
  return CORPUS_STAT_OPTIONS.find((o) => o.value === key)?.label ?? '-';
};

export const potentialLabel = (p: { name: string; type: { name: string } }) =>
  `${p.type.name} - ${p.name}`;

/* -------------------------------------------------------------------------- */
/*                                 Équipement                                 */
/* -------------------------------------------------------------------------- */

export const ARMOR_TYPE_OPTIONS = [
  { value: 'LOW', label: 'Légère' },
  { value: 'PARTIAL', label: 'Partielle' },
  { value: 'FULL', label: 'Complète' },
];

export const armorTypeLabel = (type: string | null | undefined) =>
  ARMOR_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? '-';

/** Les caractères qu'un équipement peut exiger, par leur abréviation. */
export const PREREQUISITE_STAT_OPTIONS = CHARACTERISTICS.map((c) => ({
  value: c.key as string,
  label: c.abbr,
}));

/**
 * Prérequis d'un équipement : le caractère exigé (s'il y en a un), le texte
 * tapé (« For 40 »), et s'il est rempli par les caractères de la fiche.
 */
export const prerequisiteOf = (
  row: {
    prerequisite_stat?: string | null;
    prerequisite_value?: number | null;
  },
  values: CharacteristicValues,
) => {
  const stat =
    CHARACTERISTICS.find(
      (c) => c.key === normalizeStat(row.prerequisite_stat),
    ) ?? null;
  return {
    stat,
    text: stat ? `${stat.abbr} ${row.prerequisite_value ?? ''}`.trim() : '-',
    met: meetsPrerequisite(
      values,
      row.prerequisite_stat,
      row.prerequisite_value,
    ),
    /** Valeur du caractère exigé sur la fiche. */
    current: stat ? values[stat.key] : null,
  };
};

/* -------------------------------------------------------------------------- */
/*                                 Expérience                                 */
/* -------------------------------------------------------------------------- */

export type XpStatus = 'Validée' | 'En création' | 'Reset en cours';

/** État de la fiche vis-à-vis de l'XP : validée, en création, reset en cours. */
export const xpStatusLabel = (xp: Pick<XpSummary, 'unlocked'>): XpStatus =>
  xp.unlocked.length === 0
    ? 'Validée'
    : xp.unlocked.length === ALL_SCOPES.length
      ? 'En création'
      : 'Reset en cours';

/**
 * Puce de la vue d'ensemble d'une table pour une fiche pas encore validée :
 * « à valider » quand l'XP reçue suffit, « en création » sinon.
 */
export const xpListChip = (xp: Pick<XpSummary, 'unlocked' | 'allocation'>) =>
  xp.unlocked.length === 0
    ? null
    : xp.allocation.feasible
      ? 'à valider'
      : 'en création';

/**
 * Les trois temps de la création, dans l'ordre (voir `creationStep`). Les
 * deux-points sont précédés d'une espace insécable : jamais en début de ligne.
 */
export const CREATION_STEPS = [
  "Recevoir l'XP de création du MJ",
  'Répartir les points : tout se modifie librement',
  'Valider la fiche : son coût est payé, puis elle se verrouille',
] as const;

/** Libellé court d'une étape, pour le rappel en haut de la fiche. */
export const CREATION_STEP_SHORT = [
  "recevoir l'XP de création du MJ",
  'répartir les points',
  'valider la fiche',
] as const;
