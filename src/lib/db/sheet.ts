import { Prisma } from '@prisma/client';

/** Champs publics d'un·e utilisateur·ice (pas d'email ni de rôle). */
export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  image: true,
} satisfies Prisma.UserSelect;

const byCreation = { orderBy: { createdAt: 'asc' } } as const;

export const POTENTIAL_INCLUDE = {
  type: { include: { category: true } },
} satisfies Prisma.PotentialInclude;

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
  xpEntries: {
    orderBy: { seq: 'asc' },
    include: { author: { select: PUBLIC_USER_SELECT } },
  },
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
