import prisma from '@/lib/db/prisma';
import {
  handle,
  HttpError,
  readJson,
  requireAdmin,
  requireUser,
} from '@/lib/server/api';
import { NextRequest } from 'next/server';

export const GET = () =>
  handle(async () => {
    await requireUser();
    return prisma.property.findMany({ orderBy: { name: 'asc' } });
  });

/** Les MJ peuvent enrichir le catalogue des propriétés d'équipement. */
export const POST = (req: NextRequest) =>
  handle(async () => {
    await requireAdmin();
    const { name, description } = await readJson(req);
    const trimmed = String(name ?? '').trim();
    if (!trimmed) throw new HttpError(400, 'Nom manquant.');
    const existing = await prisma.property.findFirst({
      where: { name: { equals: trimmed, mode: 'insensitive' } },
    });
    if (existing) return existing;
    return prisma.property.create({
      data: {
        name: trimmed,
        description: description ? String(description) : null,
      },
    });
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
