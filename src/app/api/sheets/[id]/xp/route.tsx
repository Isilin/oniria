import prisma from '@/lib/db/prisma';
import { SHEET_INCLUDE } from '@/lib/db/sheet';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { grantXp, readGrant } from '@/lib/server/xp';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** MJ : attribue (ou retire, montants négatifs) de l'XP à une fiche. */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const user = await requireAdmin();
    const grant = readGrant(await readJson(req));
    const exists = await prisma.sheet.count({ where: { id: params.id } });
    if (!exists) throw new HttpError(404, 'Fiche introuvable.');
    await prisma.$transaction((tx) => grantXp(tx, [params.id], user, grant));
    return prisma.sheet.findUnique({
      where: { id: params.id },
      include: SHEET_INCLUDE,
    });
  });
