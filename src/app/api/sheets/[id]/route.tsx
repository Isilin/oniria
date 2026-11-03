import prisma from '@/lib/db/prisma';
import { SHEET_INCLUDE } from '@/lib/db/sheet';
import { CharacteristicKey } from '@/lib/rules';
import {
  CHARACTERISTIC_MAX,
  CHARACTERISTIC_MIN,
  characteristicChange,
} from '@/lib/rules/xp';
import {
  handle,
  HttpError,
  readJson,
  requireSheetEditor,
  requireUser,
} from '@/lib/server/api';
import { chargeChange, lockSheet, readXpPayload } from '@/lib/server/xp';
import { SHEET_FIELDS, sanitizeFields, STAT_KEYS } from '@/lib/sheet/fields';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export const GET = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireUser();
    const sheet = await prisma.sheet.findUnique({
      where: { id: params.id },
      include: SHEET_INCLUDE,
    });
    if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
    return sheet;
  });

/**
 * Modifie la fiche. Changer une caractéristique d'une partie validée est un
 * achat (ou, pour le MJ, une baisse avec remboursement ou perte) : son
 * paiement est dans `xp`.
 */
export const PATCH = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    const body = await readJson(req);
    const data = sanitizeFields(SHEET_FIELDS, body);
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

    return prisma.$transaction(async (tx) => {
      await lockSheet(tx, params.id);
      const current = await tx.sheet.findUnique({ where: { id: params.id } });
      const changes = STAT_KEYS.filter((key) => key in data)
        .map((key) =>
          characteristicChange(
            key as CharacteristicKey,
            current[key],
            data[key] as number | null,
          ),
        )
        .filter(
          (change) =>
            change.delta !== 0 && !current.unlocked.includes(change.scope),
        );
      if (changes.length > 1) {
        throw new HttpError(
          400,
          'Une seule caractéristique validée à la fois : chacune est un achat.',
        );
      }
      for (const change of changes) {
        await chargeChange(
          tx,
          params.id,
          { ...change, target: change.target! },
          user,
          payload,
        );
      }
      return tx.sheet.update({
        where: { id: params.id },
        data,
        include: SHEET_INCLUDE,
      });
    });
  });

export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireSheetEditor(params.id);
    await prisma.sheet.delete({ where: { id: params.id } });
    return null;
  });
