import { auth } from '@/app/auth';
import prisma from '@/lib/db/prisma';
import { contentDisposition } from '@/lib/helpers/download';
import { ValidationError } from '@/lib/sheet/fields';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { HttpError } from './errors';

export { HttpError };

/** Réponse JSON d'une erreur levée par un handler d'API. */
const errorResponse = (error: unknown) => {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  if (error instanceof ValidationError || error instanceof SyntaxError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return NextResponse.json({ error: 'Existe déjà.' }, { status: 409 });
  }
  console.error(error);
  return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
};

/** Exécute un handler d'API et convertit les erreurs en réponses JSON. */
export const handle = async (fn: () => Promise<unknown>) => {
  try {
    const result = await fn();
    return NextResponse.json(result ?? null);
  } catch (error) {
    return errorResponse(error);
  }
};

/**
 * Comme `handle`, pour un fichier à télécharger (export PDF) : le fichier
 * en cas de succès, la même erreur JSON sinon.
 */
export const handleFile = async (
  fn: () => Promise<{ body: Uint8Array; filename: string; type: string }>,
) => {
  try {
    const { body, filename, type } = await fn();
    return new NextResponse(new Uint8Array(body), {
      headers: {
        'Content-Type': type,
        'Content-Disposition': contentDisposition(filename),
        'Content-Length': String(body.byteLength),
        // La fiche d'un·e joueur·euse : jamais en cache partagé.
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
};

export const requireUser = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new HttpError(401, 'Non connecté.');
  return { ...session.user, id: session.user.id };
};

export const requireAdmin = async () => {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new HttpError(403, 'Réservé aux MJ.');
  return user;
};

/** Seul·e le·a propriétaire de la fiche ou un·e admin peut la modifier. */
export const requireSheetEditor = async (sheetId: string) => {
  // Session et propriétaire lus en parallèle : un aller-retour en base de
  // moins à chaque modification. La session reste vérifiée en premier.
  const [user, sheet] = await Promise.all([
    requireUser(),
    prisma.sheet.findUnique({
      where: { id: sheetId },
      select: { id: true, userId: true },
    }),
  ]);
  if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
  if (sheet.userId !== user.id && user.role !== 'ADMIN') {
    throw new HttpError(403, "Cette fiche ne t'appartient pas.");
  }
  return { user, sheet };
};

/** Corps de la requête : toujours un objet JSON (sinon, 400). */
export const readJson = async (req: Request) => {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new HttpError(400, 'JSON invalide.');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Données invalides.');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return body as Record<string, any>;
};
