import prisma from '@/lib/db/prisma';
import { handle, readJson, requireAdmin } from '@/lib/server/api';
import { listWhitelist } from '@/lib/server/queries';
import { explainDuplicate, normalizeEmail } from '@/lib/server/whitelist';
import { NextRequest } from 'next/server';

export const GET = () =>
  handle(async () => {
    await requireAdmin();
    return listWhitelist();
  });

export const POST = (req: NextRequest) =>
  handle(async () => {
    await requireAdmin();
    const { email } = await readJson(req);
    const data = { email: normalizeEmail(email) };
    return explainDuplicate(() => prisma.whitelist.create({ data }));
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
