import prisma from '@/lib/db/prisma';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** Ajoute une fiche à la table. */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    const { sheetId } = await readJson(req);
    if (!sheetId) throw new HttpError(400, 'Fiche manquante.');
    return prisma.team.update({
      where: { id: params.id },
      data: { members: { connect: [{ id: String(sheetId) }] } },
    });
  });
