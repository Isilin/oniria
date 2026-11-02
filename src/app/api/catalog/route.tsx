import prisma from '@/lib/db/prisma';
import {
  Catalog,
  POTENTIAL_INCLUDE,
  SKILL_CATALOG_INCLUDE,
} from '@/lib/db/sheet';
import { handle, requireUser } from '@/lib/server/api';

/** Catalogues de règles : types de Corpus, potentiels, compétences, propriétés. */
export const GET = () =>
  handle(async (): Promise<Catalog> => {
    await requireUser();
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
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
