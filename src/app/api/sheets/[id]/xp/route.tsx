import prisma from '@/lib/db/prisma';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { grantXp, readGrant, readXpState } from '@/lib/server/xp';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/**
 * MJ : attribue (ou retire, montants négatifs) de l'XP à une fiche. Une seule
 * écriture, atomique à elle seule : pas besoin de transaction. Renvoie le
 * journal à jour.
 */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const user = await requireAdmin();
    const grant = readGrant(await readJson(req));
    await grantXp(prisma, [params.id], user, grant).catch((error) => {
      // Fiche inexistante : la clé étrangère est refusée.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new HttpError(404, 'Fiche introuvable.');
      }
      throw error;
    });
    return readXpState(prisma, params.id);
  });
