import { auth } from '@/app/auth';
import prisma from '@/lib/db/prisma';
import { ValidationError } from '@/lib/sheet/fields';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Exécute un handler d'API et convertit les erreurs en réponses JSON. */
export const handle = async (fn: () => Promise<unknown>) => {
  try {
    const result = await fn();
    return NextResponse.json(result ?? null);
  } catch (error) {
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
  }
};

export const requireUser = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new HttpError(401, 'Non connecté.');
  return session.user;
};

export const requireAdmin = async () => {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new HttpError(403, 'Réservé aux MJ.');
  return user;
};

/** Seul·e le·a propriétaire de la fiche ou un·e admin peut la modifier. */
export const requireSheetEditor = async (sheetId: string) => {
  const user = await requireUser();
  const sheet = await prisma.sheet.findUnique({
    where: { id: sheetId },
    select: { id: true, userId: true },
  });
  if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
  if (sheet.userId !== user.id && user.role !== 'ADMIN') {
    throw new HttpError(403, "Cette fiche ne t'appartient pas.");
  }
  return { user, sheet };
};

export const readJson = async (req: Request) => {
  try {
    return await req.json();
  } catch {
    throw new HttpError(400, 'JSON invalide.');
  }
};
