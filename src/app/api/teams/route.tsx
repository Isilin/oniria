import prisma from '@/lib/db/prisma';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { listTeams } from '@/lib/server/queries';
import { NextRequest } from 'next/server';

export const GET = () =>
  handle(async () => {
    await requireAdmin();
    return listTeams();
  });

export const POST = (req: NextRequest) =>
  handle(async () => {
    await requireAdmin();
    const { name } = await readJson(req);
    if (!name) throw new HttpError(400, 'Nom manquant.');
    return prisma.team.create({ data: { name: String(name) } });
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
