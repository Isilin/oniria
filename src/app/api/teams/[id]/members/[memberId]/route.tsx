import prisma from '@/lib/db/prisma';
import { handle, requireAdmin } from '@/lib/server/api';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string; memberId: string }> };

/** Retire une fiche de la table (la fiche n'est pas supprimée). */
export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    return prisma.team.update({
      where: { id: params.id },
      data: { members: { disconnect: [{ id: params.memberId }] } },
    });
  });
