import { handle, readJson, requireSheetEditor } from '@/lib/server/api';
import { deleteItem, updateItem } from '@/lib/server/collections';
import { NextRequest } from 'next/server';

type Params = {
  params: Promise<{ id: string; collection: string; itemId: string }>;
};

export const PATCH = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    return updateItem(
      params.id,
      params.collection,
      params.itemId,
      await readJson(req),
      user,
    );
  });

/** `?refund=false` : le MJ retire un élément validé sans rembourser l'XP. */
export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    const { user } = await requireSheetEditor(params.id);
    // L'écriture d'XP s'il y en a une (remboursement, perte), sinon null.
    return deleteItem(params.id, params.collection, params.itemId, user, {
      refund: req.nextUrl.searchParams.get('refund') !== 'false',
    });
  });
