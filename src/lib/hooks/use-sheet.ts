'use client';

import { SheetGetResult } from '@/app/api/sheets/route';
import { XpAnswer, useXpDialogs } from '@/components/organisms/xp-dialogs';
import { CharacteristicKey, computeSheet } from '@/lib/rules';
import {
  characteristicChange,
  corpusChange,
  Scope,
  SCOPE_BY_KEY,
  skillChange,
  spyreeChange,
  suggestRefund,
  XpChange,
  xpSummary,
} from '@/lib/rules/xp';
import { CollectionKey, STAT_KEYS } from '@/lib/sheet/fields';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { FullSheet } from '../db/sheet';
import fetcher, { request } from '../helpers/swr';
import { useCatalog } from './use-catalog';

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
  Partial<CollectionItem<K>> | Record<string, unknown>;

/** Listes dont les changements coûtent de l'XP. */
const XP_COLLECTIONS: CollectionKey[] = ['skills', 'corpus', 'spyree'];

/** Paiement envoyé à l'API (`xp`), ou null si l'utilisateur·ice annule. */
type Paid = { xp?: Record<string, unknown> } | null;

const toWire = (answer: XpAnswer) =>
  answer.split ? { ...answer.split } : { ...answer };

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

  const { catalog } = useCatalog();
  const dialogs = useXpDialogs();

  const computed = useMemo(() => (sheet ? computeSheet(sheet) : null), [sheet]);
  const xp = useMemo(() => (sheet ? xpSummary(sheet) : null), [sheet]);

  const isAdmin = session?.user?.role === 'ADMIN';
  const canEdit =
    !!session?.user && !!sheet && (isAdmin || session.user.id === sheet.userId);

  /** Partie validée : achats seulement (baisser ou retirer : MJ). */
  const isLocked = useCallback(
    (scope: Scope) => !!sheet && !sheet.unlocked.includes(scope),
    [sheet],
  );

  const notifyError = useCallback(
    (e: unknown) => {
      enqueueSnackbar(e instanceof Error ? e.message : 'Erreur inconnue.', {
        variant: 'error',
      });
    },
    [enqueueSnackbar],
  );

  /**
   * Fait payer un changement d'une partie validée : dialogue d'achat, ou de
   * reprise pour le MJ. Rien à payer dans une partie débloquée.
   */
  const payFor = useCallback(
    async (change: XpChange | null): Promise<Paid> => {
      if (!sheet || !change || change.delta === 0 || !isLocked(change.scope)) {
        return {};
      }
      if (change.delta < 0 && !isAdmin) {
        enqueueSnackbar(
          `${SCOPE_BY_KEY[change.scope].label} est validé : seul le MJ peut baisser ou retirer ce qui a été acquis.`,
          { variant: 'warning' },
        );
        return null;
      }
      if (!dialogs) return {};
      const answer =
        change.delta > 0
          ? await dialogs.askPurchase({
              change,
              balance: xp.left,
              isAdmin,
            })
          : await dialogs.askRemoval({
              change,
              refund: suggestRefund(
                sheet.xpEntries,
                change.target,
                -change.delta,
              ),
            });
      return answer ? { xp: toWire(answer) } : null;
    },
    [sheet, xp, isAdmin, isLocked, dialogs, enqueueSnackbar],
  );

  /** Met à jour des champs de la fiche (mise à jour optimiste). */
  const update = useCallback(
    async (patch: Partial<FullSheet>) => {
      const key = STAT_KEYS.find(
        (k) => k in patch && (patch[k] ?? 0) !== (sheet?.[k] ?? 0),
      ) as CharacteristicKey | undefined;
      const paid = await payFor(
        key && sheet ? characteristicChange(key, sheet[key], patch[key]) : null,
      );
      if (!paid) return false;
      try {
        await mutate(
          () => request<FullSheet>('PATCH', url, { ...patch, ...paid }),
          {
            optimisticData: (current) => ({ ...current, ...patch }),
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
    [mutate, url, notifyError, payFor, sheet],
  );

  /** Coût d'un nouvel élément d'une liste. */
  const changeForNew = useCallback(
    (collection: CollectionKey, data: Record<string, unknown>) => {
      if (!sheet) return null;
      if (collection === 'skills') {
        const skill = catalog?.skills.find((s) => s.id === data.skillId);
        return skill ? skillChange(skill, false) : null;
      }
      if (collection === 'corpus') {
        return corpusChange(sheet.corpus.length, false);
      }
      if (collection === 'spyree') {
        const potential = catalog?.potentials.find(
          (p) => p.id === data.potentialId,
        );
        return spyreeChange(
          potential?.name ?? '?',
          0,
          (data.level as number) ?? 1,
        );
      }
      return null;
    },
    [sheet, catalog],
  );

  /** Coût du retrait d'un élément d'une liste. */
  const changeForRemoval = useCallback(
    (collection: CollectionKey, itemId: string) => {
      if (!sheet) return null;
      if (collection === 'skills') {
        const owned = sheet.skills.find((s) => s.id === itemId);
        return owned ? skillChange(owned.skill, true, itemId) : null;
      }
      if (collection === 'corpus') {
        return corpusChange(sheet.corpus.length, true);
      }
      if (collection === 'spyree') {
        const owned = sheet.spyree.find((s) => s.id === itemId);
        return owned
          ? spyreeChange(owned.potential.name, owned.level, 0, itemId)
          : null;
      }
      return null;
    },
    [sheet],
  );

  const createItem = useCallback(
    async <K extends CollectionKey>(collection: K, data: ItemPatch<K>) => {
      const paid = await payFor(
        changeForNew(collection, data as Record<string, unknown>),
      );
      if (!paid) return null;
      try {
        let created: CollectionItem<K>;
        await mutate(
          async (current) => {
            created = await request<CollectionItem<K>>(
              'POST',
              `${url}/${collection}`,
              { ...data, ...paid },
            );
            return {
              ...current,
              [collection]: [...current[collection], created],
            };
          },
          // Le journal d'XP a changé : on recharge la fiche.
          { revalidate: XP_COLLECTIONS.includes(collection) },
        );
        return created;
      } catch (e) {
        notifyError(e);
        return null;
      }
    },
    [mutate, url, notifyError, payFor, changeForNew],
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
      const fields = patch as Record<string, unknown>;
      const spyree =
        collection === 'spyree' && 'level' in fields
          ? sheet?.spyree.find((s) => s.id === itemId)
          : null;
      const paid = await payFor(
        spyree
          ? spyreeChange(
              spyree.potential.name,
              spyree.level,
              fields.level as number,
              itemId,
            )
          : null,
      );
      if (!paid) return false;
      try {
        await mutate(
          async (current) =>
            replace(
              current,
              await request<Record<string, unknown>>(
                'PATCH',
                `${url}/${collection}/${itemId}`,
                { ...fields, ...paid },
              ),
            ),
          {
            optimisticData: (current) => replace(current, scalarPart(fields)),
            rollbackOnError: true,
            revalidate: !!spyree,
          },
        );
        return true;
      } catch (e) {
        notifyError(e);
        return false;
      }
    },
    [mutate, url, notifyError, payFor, sheet],
  );

  const deleteItem = useCallback(
    async (collection: CollectionKey, itemId: string) => {
      const remove = (current: FullSheet) => ({
        ...current,
        [collection]: (current[collection] as { id: string }[]).filter(
          (i) => i.id !== itemId,
        ),
      });
      const paid = await payFor(changeForRemoval(collection, itemId));
      if (!paid) return false;
      const query = paid.xp?.refund === false ? '?refund=false' : '';
      try {
        await mutate(
          async (current) => {
            await request('DELETE', `${url}/${collection}/${itemId}${query}`);
            return remove(current);
          },
          {
            optimisticData: remove,
            rollbackOnError: true,
            // Le journal d'XP a changé : on recharge la fiche.
            revalidate: XP_COLLECTIONS.includes(collection),
          },
        );
        return true;
      } catch (e) {
        notifyError(e);
        return false;
      }
    },
    [mutate, url, notifyError, payFor, changeForRemoval],
  );

  /** Actions d'XP qui renvoient la fiche à jour. */
  const xpAction = useCallback(
    async (path: string, body?: unknown, success?: string) => {
      try {
        await mutate(
          () => request<FullSheet>('POST', `${url}/xp${path}`, body),
          {
            revalidate: false,
          },
        );
        if (success) enqueueSnackbar(success, { variant: 'success' });
        return true;
      } catch (e) {
        notifyError(e);
        return false;
      }
    },
    [mutate, url, notifyError, enqueueSnackbar],
  );

  const deleteGrant = useCallback(
    async (entryId: string) => {
      try {
        await request('DELETE', `${url}/xp/${entryId}`);
        await mutate();
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
    xp,
    error,
    isLoading,
    canEdit,
    isAdmin,
    isLocked,
    update,
    createItem,
    updateItem,
    deleteItem,
    deleteSheet,
    /** MJ : attribue (ou retire) de l'XP. */
    grantXp: (grant: {
      label: string;
      feel: number;
      learn: number;
      live: number;
    }) => xpAction('', grant, 'XP attribuée.'),
    /** Valide la création ou ce que le MJ a débloqué. */
    validate: () => xpAction('/validate', undefined, 'Fiche validée.'),
    /** MJ : reset complet ou d'une partie de la fiche. */
    reset: (scopes: Scope[]) =>
      xpAction('/reset', { scopes }, 'Reset accordé.'),
    deleteGrant,
  };
};
