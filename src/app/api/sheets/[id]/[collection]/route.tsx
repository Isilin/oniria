import { handle, readJson, requireSheetEditor } from '@/lib/server/api';
import { createItem } from '@/lib/server/collections';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string; collection: string }> };

export const POST = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireSheetEditor(params.id);
    return createItem(params.id, params.collection, await readJson(req));
  });
