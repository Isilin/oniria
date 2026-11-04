import prisma from '@/lib/db/prisma';
import { handle, readJson, requireAdmin } from '@/lib/server/api';
import { explainDuplicate, normalizeEmail } from '@/lib/server/whitelist';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/** Corrige une adresse (mêmes règles qu'à l'ajout ; 409 si elle existe déjà). */
export const PATCH = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    const { email } = await readJson(req);
    const data = { email: normalizeEmail(email) };
    return explainDuplicate(() =>
      prisma.whitelist.update({ where: { id: params.id }, data }),
    );
  });

export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    await prisma.whitelist.delete({ where: { id: params.id } });
    return null;
  });
