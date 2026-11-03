import { Catalog } from '@/lib/db/sheet';
import { handle, requireUser } from '@/lib/server/api';
import { loadCatalog } from '@/lib/server/queries';

/** Catalogues de règles : types de Corpus, potentiels, compétences, propriétés. */
export const GET = () =>
  handle(async (): Promise<Catalog> => {
    await requireUser();
    return loadCatalog();
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
