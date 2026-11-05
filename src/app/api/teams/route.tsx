import prisma from '@/lib/db/prisma';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { listTeams } from '@/lib/server/queries';
import { readName } from '@/lib/sheet/fields';
import { NextRequest } from 'next/server';

export const GET = () =>
  handle(async () => {
    await requireAdmin();
    return listTeams();
  });

export const POST = (req: NextRequest) =>
  handle(async () => {
    await requireAdmin();
    const name = readName((await readJson(req)).name);
    if (!name) throw new HttpError(400, 'Nom manquant.');
    return prisma.team.create({ data: { name } });
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
