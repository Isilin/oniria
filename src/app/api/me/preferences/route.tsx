import prisma from '@/lib/db/prisma';
import { parsePreferences } from '@/lib/preferences';
import { handle, readJson, requireUser } from '@/lib/server/api';
import { NextRequest } from 'next/server';

/** Réglages de l'interface de la personne connectée. */
export const GET = () =>
  handle(async () => {
    const user = await requireUser();
    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { preferences: true },
    });
    return parsePreferences(row?.preferences);
  });

/** Fusionne les réglages envoyés avec ceux déjà enregistrés. */
export const PATCH = (req: NextRequest) =>
  handle(async () => {
    const user = await requireUser();
    const patch = parsePreferences(await readJson(req));
    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { preferences: true },
    });
    const preferences = { ...parsePreferences(row?.preferences), ...patch };
    await prisma.user.update({
      where: { id: user.id },
      data: { preferences },
    });
    return preferences;
  });

// Réponses propres à l'utilisateur·ice connecté·e : jamais mises en cache.
export const dynamic = 'force-dynamic';
