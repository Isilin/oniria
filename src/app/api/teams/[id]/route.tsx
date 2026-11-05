import prisma from '@/lib/db/prisma';
import { handle, HttpError, readJson, requireAdmin } from '@/lib/server/api';
import { findTeam } from '@/lib/server/queries';
import { readName } from '@/lib/sheet/fields';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export const GET = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    const team = await findTeam(params.id);
    if (!team) throw new HttpError(404, 'Table introuvable.');
    return team;
  });

export const PATCH = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    const name = readName((await readJson(req)).name);
    if (!name) throw new HttpError(400, 'Nom manquant.');
    return prisma.team.update({
      where: { id: params.id },
      data: { name },
    });
  });

export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    await prisma.team.delete({ where: { id: params.id } });
    return null;
  });
