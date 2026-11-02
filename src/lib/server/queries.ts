import prisma from '@/lib/db/prisma';
import {
  Catalog,
  POTENTIAL_INCLUDE,
  SHEET_INCLUDE,
  SHEET_SUMMARY_INCLUDE,
  SheetGetResult,
  SKILL_CATALOG_INCLUDE,
  TEAM_INCLUDE,
  TEAM_SUMMARY_INCLUDE,
} from '@/lib/db/sheet';

/*
 * Lectures partagées par l'API et par les pages : une page rendue côté
 * serveur arrive avec ses données, sans attendre un appel à l'API après
 * le chargement du JavaScript.
 */

export const findSheet = (id: string) =>
  prisma.sheet.findUnique({ where: { id }, include: SHEET_INCLUDE });

/** Toutes les fiches en une requête, réparties entre les siennes et les autres. */
export const listSheets = async (userId: string): Promise<SheetGetResult> => {
  const sheets = await prisma.sheet.findMany({
    include: SHEET_SUMMARY_INCLUDE,
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  });
  return {
    own: sheets.filter((s) => s.userId === userId),
    others: sheets.filter((s) => s.userId !== userId),
  };
};

export const listTeams = () =>
  prisma.team.findMany({
    include: TEAM_SUMMARY_INCLUDE,
    orderBy: { name: 'asc' },
  });

export const findTeam = (id: string) =>
  prisma.team.findUnique({ where: { id }, include: TEAM_INCLUDE });

export const listWhitelist = () =>
  prisma.whitelist.findMany({ orderBy: { email: 'asc' } });

/** Catalogues de règles : types de Corpus, potentiels, compétences, propriétés. */
export const loadCatalog = async (): Promise<Catalog> => {
  const [corpusTypes, potentials, skills, properties] = await Promise.all([
    prisma.corpusType.findMany({ orderBy: { name: 'asc' } }),
    prisma.potential.findMany({
      include: POTENTIAL_INCLUDE,
      orderBy: [{ type: { category: { name: 'asc' } } }, { name: 'asc' }],
    }),
    prisma.skill.findMany({
      include: SKILL_CATALOG_INCLUDE,
      orderBy: [{ type: 'asc' }, { category: 'asc' }],
    }),
    prisma.property.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return { corpusTypes, potentials, skills, properties };
};

/**
 * Même forme que la réponse JSON de l'API (dates en chaînes) : les données
 * envoyées par la page et celles rechargées ensuite par SWR sont identiques.
 */
export const asJson = <T>(data: T): T => JSON.parse(JSON.stringify(data));
