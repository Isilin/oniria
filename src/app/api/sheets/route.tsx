import prisma from '@/lib/db/prisma';
import { SHEET_SUMMARY_INCLUDE, SheetWithUser } from '@/lib/db/sheet';
import { handle, readJson, requireUser } from '@/lib/server/api';
import { NextRequest } from 'next/server';

export interface SheetGetResult {
  own: SheetWithUser[];
  others: SheetWithUser[];
}

export const GET = () =>
  handle(async (): Promise<SheetGetResult> => {
    const user = await requireUser();

    const [own, others] = await Promise.all([
      prisma.sheet.findMany({
        where: { userId: user.id },
        include: SHEET_SUMMARY_INCLUDE,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.sheet.findMany({
        where: { userId: { not: user.id } },
        include: SHEET_SUMMARY_INCLUDE,
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return { own, others };
  });

export const POST = (req: NextRequest) =>
  handle(async () => {
    const user = await requireUser();
    const { name } = await readJson(req);

    return prisma.sheet.create({
      data: {
        user: { connect: { id: user.id } },
        name: name ? String(name) : 'Sans nom',
      },
    });
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
