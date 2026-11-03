import prisma from '@/lib/db/prisma';
import { SHEET_INCLUDE } from '@/lib/db/sheet';
import { handle, readJson, requireAdmin } from '@/lib/server/api';
import { readScopes, resetSheet } from '@/lib/server/xp';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** MJ : reset complet ou d'une partie de la fiche (`scopes`). */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const user = await requireAdmin();
    const scopes = readScopes(await readJson(req));
    await prisma.$transaction((tx) => resetSheet(tx, params.id, user, scopes));
    return prisma.sheet.findUnique({
      where: { id: params.id },
      include: SHEET_INCLUDE,
    });
  });
