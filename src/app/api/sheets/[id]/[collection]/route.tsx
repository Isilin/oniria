import { handle, readJson, requireSheetEditor } from '@/lib/server/api';
import { createItem } from '@/lib/server/collections';
import { NextRequest } from 'next/server';

type Params = { params: { id: string; collection: string } };

export const POST = (req: NextRequest, { params }: Params) =>
  handle(async () => {
    await requireSheetEditor(params.id);
    return createItem(params.id, params.collection, await readJson(req));
  });
