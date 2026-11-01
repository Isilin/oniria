import prisma from '@/lib/db/prisma';
import { SHEET_INCLUDE } from '@/lib/db/sheet';
import {
  handle,
  HttpError,
  readJson,
  requireSheetEditor,
  requireUser,
} from '@/lib/server/api';
import { SHEET_FIELDS, sanitizeFields } from '@/lib/sheet/fields';
import { NextRequest } from 'next/server';

type Params = { params: { id: string } };

export const GET = (req: NextRequest, { params }: Params) =>
  handle(async () => {
    await requireUser();
    const sheet = await prisma.sheet.findUnique({
      where: { id: params.id },
      include: SHEET_INCLUDE,
    });
    if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
    return sheet;
  });

export const PATCH = (req: NextRequest, { params }: Params) =>
  handle(async () => {
    await requireSheetEditor(params.id);
    const data = sanitizeFields(SHEET_FIELDS, await readJson(req));

    return prisma.sheet.update({
      where: { id: params.id },
      data,
      include: SHEET_INCLUDE,
    });
  });

export const DELETE = (req: NextRequest, { params }: Params) =>
  handle(async () => {
    await requireSheetEditor(params.id);
    await prisma.sheet.delete({ where: { id: params.id } });
    return null;
  });
