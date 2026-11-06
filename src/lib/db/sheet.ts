import { Prisma } from '@prisma/client';

/** Champs publics d'un·e utilisateur·ice (pas d'email ni de rôle). */
export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  image: true,
} satisfies Prisma.UserSelect;

// L'id départage les éléments créés au même instant : ordre stable d'un
// chargement à l'autre.
const byCreation = {
  orderBy: [{ createdAt: 'asc' as const }, { id: 'asc' as const }],
};

export const POTENTIAL_INCLUDE = {
  type: { include: { category: true } },
} satisfies Prisma.PotentialInclude;

/** Journal d'XP d'une fiche, dans l'ordre, avec l'auteur de chaque écriture. */
export const XP_ENTRIES_ARGS = {
  orderBy: { seq: 'asc' as const },
  include: { author: { select: PUBLIC_USER_SELECT } },
} satisfies Prisma.Sheet$xpEntriesArgs;

export const SHEET_INCLUDE = {
  user: { select: PUBLIC_USER_SELECT },
  teams: { select: { id: true, name: true } },
  corpus: { ...byCreation, include: { type: true } },
  spyree: {
    ...byCreation,
    include: { potential: { include: POTENTIAL_INCLUDE } },
  },
  amee: byCreation,
  traits: byCreation,
  skills: { ...byCreation, include: { skill: true } },
  spells: byCreation,
  golems: byCreation,
  armors: { ...byCreation, include: { properties: true } },
  meleeWeapons: { ...byCreation, include: { properties: true } },
  rangeWeapons: { ...byCreation, include: { properties: true } },
  items: byCreation,
  xpEntries: XP_ENTRIES_ARGS,
} satisfies Prisma.SheetInclude;

export const SHEET_SUMMARY_INCLUDE = {
  user: { select: PUBLIC_USER_SELECT },
} satisfies Prisma.SheetInclude;

export type FullSheet = Prisma.SheetGetPayload<{
  include: typeof SHEET_INCLUDE;
}>;

export type SheetWithUser = Prisma.SheetGetPayload<{
  include: typeof SHEET_SUMMARY_INCLUDE;
}>;

/**
 * Où en est l'XP d'une fiche de la liste, comme dans la vue d'ensemble des
 * tables : `creation` (en création, ou reset en cours, et l'XP ne couvre
 * pas encore ce qui est à payer), `ready` (à valider), `null` (validée).
 */
export type SheetXpStatus = 'creation' | 'ready' | null;

export type SheetListItem = SheetWithUser & { xpStatus: SheetXpStatus };

/** Fiches de l'accueil : les siennes, puis celles des autres. */
export interface SheetGetResult {
  own: SheetListItem[];
  others: SheetListItem[];
}

/* -------------------------------------------------------------------------- */
/*                               Tables de jeu                                */
/* -------------------------------------------------------------------------- */

export const TEAM_SUMMARY_INCLUDE = {
  members: { select: { id: true, name: true } },
} satisfies Prisma.TeamInclude;

export const TEAM_INCLUDE = {
  members: { include: SHEET_INCLUDE, orderBy: { name: 'asc' } },
} satisfies Prisma.TeamInclude;

export type TeamSummary = Prisma.TeamGetPayload<{
  include: typeof TEAM_SUMMARY_INCLUDE;
}>;

export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: typeof TEAM_INCLUDE;
}>;

/* -------------------------------------------------------------------------- */
/*                                 Catalogues                                 */
/* -------------------------------------------------------------------------- */

export const SKILL_CATALOG_INCLUDE = {
  prerequisites: { select: { id: true } },
} satisfies Prisma.SkillInclude;

export type CatalogSkill = Prisma.SkillGetPayload<{
  include: typeof SKILL_CATALOG_INCLUDE;
}>;

export type CatalogPotential = Prisma.PotentialGetPayload<{
  include: typeof POTENTIAL_INCLUDE;
}>;

export interface Catalog {
  corpusTypes: Prisma.CorpusTypeGetPayload<object>[];
  potentials: CatalogPotential[];
  skills: CatalogSkill[];
  properties: Prisma.PropertyGetPayload<object>[];
}
