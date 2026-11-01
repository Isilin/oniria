'use client';

import { SheetGetResult } from '@/app/api/sheets/route';
import { computeSheet } from '@/lib/rules';
import { CollectionKey } from '@/lib/sheet/fields';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { FullSheet } from '../db/sheet';
import fetcher, { request } from '../helpers/swr';

export const useSheets = () => {
  const {
    data: sheets,
    error,
    isLoading,
    mutate,
  } = useSWR<SheetGetResult>('/api/sheets', fetcher);

  const createSheet = async (name: string) => {
    const sheet = await request<FullSheet>('POST', '/api/sheets', { name });
    await mutate();
    return sheet;
  };

  return { sheets, error, isLoading, createSheet };
};

export type CollectionItem<K extends CollectionKey> = FullSheet[K][number];

/**
 * Données envoyées à l'API pour un élément : ses champs, plus les références
 * aux catalogues (ex. `properties: string[]` pour les propriétés d'une arme).
 */
export type ItemPatch<K extends CollectionKey> =
  | Partial<CollectionItem<K>>
  | Record<string, unknown>;

/** Les listes d'identifiants ne sont pas appliquées en optimiste. */
const scalarPart = (patch: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(patch).filter(([, v]) => !Array.isArray(v)),
  );

export const useSheet = (id: string) => {
  const url = `/api/sheets/${id}`;
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: sheet,
    error,
    isLoading,
    mutate,
  } = useSWR<FullSheet>(id ? url : null, fetcher);

  const computed = useMemo(() => (sheet ? computeSheet(sheet) : null), [sheet]);

  const canEdit =
    !!session?.user &&
    !!sheet &&
    (session.user.role === 'ADMIN' || session.user.id === sheet.userId);

  const notifyError = useCallback(
    (e: unknown) => {
      enqueueSnackbar(e instanceof Error ? e.message : 'Erreur inconnue.', {
        variant: 'error',
      });
    },
    [enqueueSnackbar],
  );

  /** Met à jour des champs de la fiche (mise à jour optimiste). */
  const update = useCallback(
    async (patch: Partial<FullSheet>) => {
      try {
        await mutate(() => request<FullSheet>('PATCH', url, patch), {
          optimisticData: (current) => ({ ...current, ...patch }),
          rollbackOnError: true,
          revalidate: false,
        });
        return true;
      } catch (e) {
        notifyError(e);
        return false;
      }
    },
    [mutate, url, notifyError],
  );

  const createItem = useCallback(
    async <K extends CollectionKey>(collection: K, data: ItemPatch<K>) => {
      try {
        let created: CollectionItem<K>;
        await mutate(
          async (current) => {
            created = await request<CollectionItem<K>>(
              'POST',
              `${url}/${collection}`,
              data,
            );
            return {
              ...current,
              [collection]: [...current[collection], created],
            };
          },
          { revalidate: false },
        );
        return created;
      } catch (e) {
        notifyError(e);
        return null;
      }
    },
    [mutate, url, notifyError],
  );

  const updateItem = useCallback(
    async <K extends CollectionKey>(
      collection: K,
      itemId: string,
      patch: ItemPatch<K>,
    ) => {
      const replace = (current: FullSheet, item: Record<string, unknown>) => ({
        ...current,
        [collection]: (current[collection] as { id: string }[]).map((i) =>
          i.id === itemId ? { ...i, ...item } : i,
        ),
      });
      try {
        await mutate(
          async (current) =>
            replace(
              current,
              await request<Record<string, unknown>>(
                'PATCH',
                `${url}/${collection}/${itemId}`,
                patch,
              ),
            ),
          {
            optimisticData: (current) =>
              replace(current, scalarPart(patch as Record<string, unknown>)),
            rollbackOnError: true,
            revalidate: false,
          },
        );
        return true;
      } catch (e) {
        notifyError(e);
        return false;
      }
    },
    [mutate, url, notifyError],
  );

  const deleteItem = useCallback(
    async (collection: CollectionKey, itemId: string) => {
      const remove = (current: FullSheet) => ({
        ...current,
        [collection]: (current[collection] as { id: string }[]).filter(
          (i) => i.id !== itemId,
        ),
      });
      try {
        await mutate(
          async (current) => {
            await request('DELETE', `${url}/${collection}/${itemId}`);
            return remove(current);
          },
          {
            optimisticData: remove,
            rollbackOnError: true,
            // Supprimer une compétence supprime aussi ses sous-compétences.
            revalidate: collection === 'skills',
          },
        );
        return true;
      } catch (e) {
        notifyError(e);
        return false;
      }
    },
    [mutate, url, notifyError],
  );

  const deleteSheet = useCallback(async () => {
    try {
      await request('DELETE', url);
      return true;
    } catch (e) {
      notifyError(e);
      return false;
    }
  }, [url, notifyError]);

  return {
    sheet,
    computed,
    error,
    isLoading,
    canEdit,
    update,
    createItem,
    updateItem,
    deleteItem,
    deleteSheet,
  };
};
