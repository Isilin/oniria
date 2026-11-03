import prisma from '@/lib/db/prisma';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { grantXp, readGrant } from '@/lib/server/xp';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/**
 * MJ : distribue la même XP aux personnages d'une table (tous, ou ceux de
 * `sheetIds`).
 */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    // Droits et membres de la table lus en parallèle.
    const [user, team] = await Promise.all([
      requireAdmin(),
      prisma.team.findUnique({
        where: { id: params.id },
        include: { members: { select: { id: true } } },
      }),
    ]);
    const body = await readJson(req);
    const grant = readGrant(body);
    if (!team) throw new HttpError(404, 'Table introuvable.');
    const members = team.members.map((m) => m.id);
    const sheetIds = Array.isArray(body.sheetIds)
      ? members.filter((id) => body.sheetIds.includes(id))
      : members;
    if (sheetIds.length === 0) {
      throw new HttpError(400, 'Aucun personnage choisi.');
    }
    // Une seule écriture (createMany), atomique à elle seule.
    await grantXp(prisma, sheetIds, user, grant);
    return { count: sheetIds.length };
  });
