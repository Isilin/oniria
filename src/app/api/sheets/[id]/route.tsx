import prisma from '@/lib/db/prisma';
import { CharacteristicKey } from '@/lib/rules';
import { CHARACTERISTIC_MAX, CHARACTERISTIC_MIN } from '@/lib/rules/xp';
import {
  handle,
  HttpError,
  readJson,
  requireSheetEditor,
  requireUser,
} from '@/lib/server/api';
import { findSheet } from '@/lib/server/queries';
import {
  chargePoints,
  lockSheet,
  readXpPayload,
  withStruckPoints,
} from '@/lib/server/xp';
import { SHEET_FIELDS, sanitizeFields, STAT_KEYS } from '@/lib/sheet/fields';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export const GET = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireUser();
    const sheet = await findSheet(params.id);
    if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
    return sheet;
  });

/**
 * Modifie la fiche. Changer des caractéristiques d'une partie validée est un
 * achat (ou, pour le MJ, une baisse avec remboursement, ou sans : les points
 * sont alors rayés) : son paiement est dans `xp` (répartition par partie
 * dans `xp.splits`).
 *
 * Renvoie seulement les champs de la fiche (pas ses listes) : le client les
 * fusionne avec ce qu'il a déjà, plus les écritures d'XP s'il y en a.
 */
export const PATCH = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    const body = await readJson(req);
    const data = sanitizeFields(SHEET_FIELDS, body);
    // Un personnage garde toujours un nom, comme à sa création.
    if ('name' in data && !data.name) data.name = 'Sans nom';
    const payload = readXpPayload(body);

    for (const key of STAT_KEYS) {
      const value = data[key];
      if (
        value !== undefined &&
        value !== null &&
        ((value as number) < CHARACTERISTIC_MIN ||
          (value as number) > CHARACTERISTIC_MAX)
      ) {
        throw new HttpError(
          400,
          `Une caractéristique va de ${CHARACTERISTIC_MIN} à ${CHARACTERISTIC_MAX}.`,
        );
      }
    }

    // Sans caractéristique, rien ne coûte d'XP : ni transaction ni verrou.
    if (!STAT_KEYS.some((key) => key in data)) {
      return prisma.sheet.update({ where: { id: params.id }, data });
    }

    return prisma.$transaction(async (tx) => {
      await lockSheet(tx, params.id);
      const current = await tx.sheet.findUnique({ where: { id: params.id } });
      const target = Object.fromEntries(
        STAT_KEYS.filter((key) => key in data).map((key) => [key, data[key]]),
      ) as Partial<Record<CharacteristicKey, number | null>>;
      const { entries: addedXpEntries, struck } = await chargePoints(
        tx,
        params.id,
        { current, target },
        user,
        payload,
      );
      if (Object.keys(struck).length) {
        data.lostPoints = withStruckPoints(current?.lostPoints, struck);
      }
      const sheet = await tx.sheet.update({ where: { id: params.id }, data });
      // Les écritures ajoutées au journal, que le client ajoute à la suite.
      return addedXpEntries.length ? { ...sheet, addedXpEntries } : sheet;
    });
  });

export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireSheetEditor(params.id);
    await prisma.sheet.delete({ where: { id: params.id } });
    return null;
  });
