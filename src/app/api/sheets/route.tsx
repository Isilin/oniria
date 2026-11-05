import prisma from '@/lib/db/prisma';
import { SheetGetResult } from '@/lib/db/sheet';
import { handle, readJson, requireUser } from '@/lib/server/api';
import { listSheets } from '@/lib/server/queries';
import { NextRequest } from 'next/server';

export const GET = () =>
  handle(async (): Promise<SheetGetResult> => {
    const user = await requireUser();
    return listSheets(user.id);
  });

export const POST = (req: NextRequest) =>
  handle(async () => {
    const user = await requireUser();
    const { name } = await readJson(req);

    return prisma.sheet.create({
      data: {
        user: { connect: { id: user.id } },
        name: name ? String(name) : 'Sans nom',
        // Une fiche neuve n'a pas d'Aspect : la valeur par défaut du schéma
        // (« Type ») s'écrivait à l'encre bleue comme si le joueur l'avait
        // choisie. Les fiches existantes gardent la leur.
        aspect: null,
      },
    });
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
