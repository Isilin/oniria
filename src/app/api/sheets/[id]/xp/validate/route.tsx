import prisma from '@/lib/db/prisma';
import { handle, requireSheetEditor } from '@/lib/server/api';
import { readXpState, validateSheet } from '@/lib/server/xp';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/**
 * Valide la création (ou ce que le MJ a débloqué) : l'XP est dépensée.
 * Renvoie les parties débloquées et le journal, seuls à changer.
 */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    return prisma.$transaction(async (tx) => {
      await validateSheet(tx, params.id, user);
      return readXpState(tx, params.id);
    });
  });
