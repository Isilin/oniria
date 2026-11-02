import { handle, readJson, requireSheetEditor } from '@/lib/server/api';
import { deleteItem, updateItem } from '@/lib/server/collections';
import { NextRequest } from 'next/server';

type Params = {
  params: Promise<{ id: string; collection: string; itemId: string }>;
};

export const PATCH = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireSheetEditor(params.id);
    return updateItem(
      params.id,
      params.collection,
      params.itemId,
      await readJson(req),
    );
  });

export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireSheetEditor(params.id);
    await deleteItem(params.id, params.collection, params.itemId);
    return null;
  });
