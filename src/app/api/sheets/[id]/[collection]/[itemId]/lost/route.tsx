import { handle, readJson, requireSheetEditor } from '@/lib/server/api';
import { restoreItem, strikeItem } from '@/lib/server/collections';
import { NextRequest } from 'next/server';

type Params = {
  params: Promise<{ id: string; collection: string; itemId: string }>;
};

/**
 * Le MJ raye un élément : il reste sur la fiche, barré et sans effet, et
 * l'XP payée pour lui est perdue. Renvoie l'élément, plus l'écriture « XP
 * perdue » s'il y en a une.
 */
export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    return strikeItem(params.id, params.collection, params.itemId, user);
  });

/**
 * Le MJ rétablit un élément rayé : offert ou racheté (paiement dans `xp`).
 * Renvoie l'élément, plus l'écriture d'achat s'il y en a une.
 */
export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    return restoreItem(
      params.id,
      params.collection,
      params.itemId,
      await readJson(req),
      user,
    );
  });
