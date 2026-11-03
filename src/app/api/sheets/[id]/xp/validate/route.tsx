import prisma from '@/lib/db/prisma';
import { SHEET_INCLUDE } from '@/lib/db/sheet';
import { handle, requireSheetEditor } from '@/lib/server/api';
import { validateSheet } from '@/lib/server/xp';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** Valide la création (ou ce que le MJ a débloqué) : l'XP est dépensée. */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    await prisma.$transaction((tx) => validateSheet(tx, params.id, user));
    return prisma.sheet.findUnique({
      where: { id: params.id },
      include: SHEET_INCLUDE,
    });
  });
