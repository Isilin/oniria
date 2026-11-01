import prisma from '@/lib/db/prisma';
import { handle, requireAdmin } from '@/lib/server/api';
import { NextRequest } from 'next/server';

type Params = { params: { id: string } };

export const DELETE = (req: NextRequest, { params }: Params) =>
  handle(async () => {
    await requireAdmin();
    await prisma.whitelist.delete({ where: { id: params.id } });
    return null;
  });
