import prisma from '@/lib/db/prisma';
import { handle, requireAdmin } from '@/lib/server/api';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    await prisma.whitelist.delete({ where: { id: params.id } });
    return null;
  });
