import prisma from '@/lib/db/prisma';
import {
  handle,
  HttpError,
  readJson,
  requireAdmin,
  requireUser,
} from '@/lib/server/api';
import { readName, TEXT_MAX } from '@/lib/sheet/fields';
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
    const trimmed = readName(name);
    if (!trimmed) throw new HttpError(400, 'Nom manquant.');
    const text = description ? String(description) : null;
    if (text && text.length > TEXT_MAX) {
      throw new HttpError(400, 'Description trop longue.');
    }
    const existing = await prisma.property.findFirst({
      where: { name: { equals: trimmed, mode: 'insensitive' } },
    });
    if (existing) return existing;
    return prisma.property.create({
      data: {
        name: trimmed,
        description: text,
      },
    });
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
