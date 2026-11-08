import prisma from '@/lib/db/prisma';
import { CharacteristicKey } from '@/lib/rules';
import {
  handle,
  HttpError,
  readJson,
  requireSheetEditor,
} from '@/lib/server/api';
import { readXpPayload, restorePoints } from '@/lib/server/xp';
import { STAT_KEYS } from '@/lib/sheet/fields';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string; key: string }> };

/**
 * Le MJ rétablit les points rayés d'une caractéristique : ils reviennent,
 * offerts ou rachetés (paiement dans `xp`, répartition dans `xp.splits`), et
 * la rature s'efface. Renvoie les champs de la fiche, plus les écritures
 * ajoutées au journal s'il y en a.
 */
export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    if (!(STAT_KEYS as readonly string[]).includes(params.key)) {
      throw new HttpError(404, 'Caractéristique inconnue.');
    }
    const payload = readXpPayload(await readJson(req));
    return prisma.$transaction((tx) =>
      restorePoints(
        tx,
        params.id,
        params.key as CharacteristicKey,
        user,
        payload,
      ),
    );
  });
