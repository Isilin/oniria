import prisma from '@/lib/db/prisma';
import { handle, readJson, requireAdmin } from '@/lib/server/api';
import { readScopes, readXpState, resetSheet } from '@/lib/server/xp';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/**
 * MJ : reset complet ou d'une partie de la fiche (`scopes`). Renvoie les
 * parties débloquées et le journal, seuls à changer.
 */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const user = await requireAdmin();
    const scopes = readScopes(await readJson(req));
    return prisma.$transaction(async (tx) => {
      await resetSheet(tx, params.id, user, scopes);
      return readXpState(tx, params.id);
    });
  });
