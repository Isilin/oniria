import prisma from '@/lib/db/prisma';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { NextRequest } from 'next/server';

export const GET = () =>
  handle(async () => {
    await requireAdmin();
    return prisma.whitelist.findMany({ orderBy: { email: 'asc' } });
  });

export const POST = (req: NextRequest) =>
  handle(async () => {
    await requireAdmin();
    const { email } = await readJson(req);
    const normalized = String(email ?? '')
      .trim()
      .toLowerCase();
    if (!/^[^\s@]+@[^\s@]+$/.test(normalized)) {
      throw new HttpError(400, 'Adresse email invalide.');
    }
    return prisma.whitelist.create({ data: { email: normalized } });
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
