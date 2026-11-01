import prisma from '@/lib/db/prisma';
import { SHEET_INCLUDE } from '@/lib/db/sheet';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export const GET = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: { include: SHEET_INCLUDE, orderBy: { name: 'asc' } },
      },
    });
    if (!team) throw new HttpError(404, 'Table introuvable.');
    return team;
  });

export const PATCH = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    const { name } = await readJson(req);
    if (!name) throw new HttpError(400, 'Nom manquant.');
    return prisma.team.update({
      where: { id: params.id },
      data: { name: String(name) },
    });
  });

export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    await prisma.team.delete({ where: { id: params.id } });
    return null;
  });
