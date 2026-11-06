import { handle, requireAdmin } from '@/lib/server/api';
import { deleteGrant } from '@/lib/server/xp';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string; entryId: string }> };

/** MJ : supprime une attribution d'XP faite par erreur. */
export const DELETE = (req: NextRequest, { params: paramsPromise }: Params) =>
  handle(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    await deleteGrant(params.id, params.entryId);
    return null;
  });
