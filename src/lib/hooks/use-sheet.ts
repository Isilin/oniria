'use client';

import { XpAnswer, useXpDialogs } from '@/components/organisms/xp-dialogs';
import { CharacteristicKey, ComputedSheet, computeSheet } from '@/lib/rules';
import {
  CHARACTERISTIC_MAX,
  CHARACTERISTIC_MIN,
  characteristicScope,
  corpusChange,
  planPoints,
  PointsPlan,
  Scope,
  SCOPE_BY_KEY,
  skillChange,
  spyreeChange,
  suggestRefund,
  XpChange,
  XpSummary,
  xpSummary,
} from '@/lib/rules/xp';
import { CollectionKey } from '@/lib/sheet/fields';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { FullSheet, SheetGetResult } from '../db/sheet';
import fetcher, { request } from '../helpers/swr';
import { useCatalog } from './use-catalog';
import { EMPTY_DRAFT, PointsDraft, usePointsDraft } from './use-points-draft';

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

/** Paiement envoyé à l'API (`xp`), ou null si l'utilisateur·ice annule. */
type Paid = { xp?: Record<string, unknown> } | null;

const toWire = (answer: XpAnswer) =>
  answer.split ? { ...answer.split } : { ...answer };

type Fields = Record<string, unknown>;
type Item = { id: string } & Fields;
type Entry = FullSheet['xpEntries'][number];

/**
 * Quand une écriture coûte ou rend de l'XP (achat, remboursement…), le
 * serveur renvoie avec sa réponse les écritures ajoutées au journal (une
 * pour un élément d'une liste, une par caractère pour des points) : inutile
 * de recharger la fiche.
 */
const splitEntries = (saved: Fields | null) => {
  const { xpEntry, addedXpEntries, ...rest } = (saved ?? {}) as Fields & {
    xpEntry?: Entry;
    addedXpEntries?: Entry[];
  };
  return {
    entries: [...(xpEntry ? [xpEntry] : []), ...(addedXpEntries ?? [])],
    rest: rest as Fields,
  };
};

const withEntries = (current: FullSheet, entries: Entry[]): FullSheet => {
  const added = entries.filter(
    (entry) => !current.xpEntries.some((e) => e.id === entry.id),
  );
  return added.length
    ? { ...current, xpEntries: [...current.xpEntries, ...added] }
    : current;
};

/** Les listes d'identifiants ne sont pas appliquées en optimiste. */
const scalarPart = (patch: Fields) =>
  Object.fromEntries(
    Object.entries(patch).filter(([, v]) => !Array.isArray(v)),
  );

/** Valeurs actuelles des champs qu'on s'apprête à modifier (pour annuler). */
const previousValues = (current: Fields, patch: Fields) =>
  Object.fromEntries(Object.keys(patch).map((k) => [k, current[k]]));

/**
 * Ce que le serveur confirme : les champs envoyés et les relations (type,
 * propriétés, journal d'XP…). Une autre modification encore en cours reste
 * affichée.
 */
const confirmed = (saved: Fields, patch: Fields) =>
  Object.fromEntries(
    Object.entries(saved ?? {}).filter(
      ([k, v]) => k in patch || (v !== null && typeof v === 'object'),
    ),
  );

/**
 * Valeurs calculées, partagées par toutes les cartes de la fiche : calculées
 * une seule fois par version de la fiche.
 */
const once = <T>(compute: (sheet: FullSheet) => T) => {
  const cache = new WeakMap<FullSheet, T>();
  return (sheet: FullSheet) => {
    if (!cache.has(sheet)) cache.set(sheet, compute(sheet));
    return cache.get(sheet) as T;
  };
};
const computeOnce = once<ComputedSheet>(computeSheet);
const summarizeOnce = once<XpSummary>(xpSummary);

/** Pareil, par version de la fiche et des points en attente. */
const onceWithDraft = <T>(
  compute: (sheet: FullSheet, draft: PointsDraft) => T,
) => {
  const cache = new WeakMap<FullSheet, WeakMap<PointsDraft, T>>();
  return (sheet: FullSheet, draft: PointsDraft) => {
    let byDraft = cache.get(sheet);
    if (!byDraft) cache.set(sheet, (byDraft = new WeakMap()));
    if (!byDraft.has(draft)) byDraft.set(draft, compute(sheet, draft));
    return byDraft.get(draft) as T;
  };
};

const pointsInput = (sheet: FullSheet, draft: PointsDraft) => ({
  current: sheet,
  target: draft,
  unlocked: sheet.unlocked,
  entries: sheet.xpEntries,
});

/** La fiche telle qu'elle serait avec les points en attente. */
const previewOnce = onceWithDraft<FullSheet>((sheet, draft) =>
  Object.keys(draft).length ? { ...sheet, ...draft } : sheet,
);
const planOnce = onceWithDraft<PointsPlan>((sheet, draft) =>
  planPoints(pointsInput(sheet, draft)),
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
  const pointsDraft = usePointsDraft();
  const draft = pointsDraft?.draft ?? EMPTY_DRAFT;

  const preview = useMemo(
    () => (sheet ? previewOnce(sheet, draft) : null),
    [sheet, draft],
  );
  /** Valeurs calculées, avec les points en attente (aperçu). */
  const computed = useMemo(
    () => (preview ? computeOnce(preview) : null),
    [preview],
  );
  /** Valeurs calculées de la fiche enregistrée. */
  const base = useMemo(() => (sheet ? computeOnce(sheet) : null), [sheet]);
  const xp = useMemo(() => (sheet ? summarizeOnce(sheet) : null), [sheet]);
  /** XP avec les points en attente (ce qu'il resterait à payer…). */
  const xpPreview = useMemo(
    () => (preview ? summarizeOnce(preview) : null),
    [preview],
  );
  const plan = useMemo(
    () => (sheet ? planOnce(sheet, draft) : null),
    [sheet, draft],
  );

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
   * Applique un changement à la fiche affichée, toujours sur sa version la
   * plus récente : deux enregistrements qui se croisent ne s'écrasent pas.
   *
   * La fiche envoyée avec la page n'est pas dans le cache de SWR : tant que
   * rien n'y est écrit, on part de celle qui est affichée.
   */
  const apply = useCallback(
    (change: (current: FullSheet) => FullSheet) =>
      mutate(
        (current) => {
          const base = current ?? sheet;
          return base ? change(base) : base;
        },
        { revalidate: false },
      ),
    [mutate, sheet],
  );

  /** En cas d'erreur : on annule à l'écran, puis on relit l'état réel. */
  const fail = useCallback(
    async (e: unknown, undo?: (current: FullSheet) => FullSheet) => {
      notifyError(e);
      if (undo) await apply(undo);
      await mutate();
    },
    [apply, mutate, notifyError],
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

  /**
   * Enregistre des champs de la fiche (affichés tout de suite, puis
   * `shown`), avec le paiement des caractères s'il y en a.
   */
  const save = useCallback(
    async (patch: Partial<FullSheet>, paid: Paid = {}, shown?: () => void) => {
      let previous: Fields = {};
      await apply((current) => {
        previous = previousValues(current, patch);
        return { ...current, ...patch };
      });
      shown?.();
      try {
        const { entries, rest } = splitEntries(
          await request<Fields>('PATCH', url, { ...patch, ...paid }),
        );
        await apply((current) =>
          withEntries({ ...current, ...confirmed(rest, patch) }, entries),
        );
        return true;
      } catch (e) {
        await fail(e, (current) => ({ ...current, ...previous }));
        return false;
      }
    },
    [apply, fail, url],
  );

  /** Met à jour des champs de la fiche (les caractères : voir `points`). */
  const update = useCallback(
    (patch: Partial<FullSheet>) => save(patch),
    [save],
  );

  /** Un caractère se baisse librement, sauf dans une partie validée (MJ). */
  const bounds = useCallback(
    (key: CharacteristicKey) => ({
      min:
        !sheet || isAdmin || !isLocked(characteristicScope(key))
          ? CHARACTERISTIC_MIN
          : (sheet[key] ?? 0),
      max: CHARACTERISTIC_MAX,
    }),
    [sheet, isAdmin, isLocked],
  );

  /** Ajoute (ou retire, si `step` est négatif) des points en attente. */
  const stepPoints = useCallback(
    (key: CharacteristicKey, step: number) => {
      if (!sheet || !pointsDraft) return;
      const { min, max } = bounds(key);
      const saved = sheet[key] ?? 0;
      pointsDraft.setDraft((current) => {
        const from = current[key] ?? saved;
        const to = Math.min(max, Math.max(min, from + step));
        if (to === from) return current;
        const next = { ...current };
        if (to === saved) delete next[key];
        else next[key] = to;
        return next;
      });
    },
    [sheet, pointsDraft, bounds],
  );

  const clearPoints = useCallback(
    () => pointsDraft?.setDraft(EMPTY_DRAFT),
    [pointsDraft],
  );

  /**
   * Valide les points en attente. Une partie débloquée s'enregistre sans
   * rien payer ; sinon, un dialogue propose la répartition (et, pour le MJ,
   * le cadeau ou le remboursement des baisses).
   */
  const commitPoints = useCallback(async () => {
    if (!sheet || !pointsDraft || !plan || plan.lines.length === 0) {
      return false;
    }
    const pending = pointsDraft.draft;
    let paid: Paid = {};
    if (plan.dues.length > 0 || plan.removals.length > 0) {
      if (!dialogs) return false;
      const input = pointsInput(sheet, pending);
      const answer = await dialogs.askPoints({
        plan,
        isAdmin,
        evaluate: (options) => planPoints(input, options),
      });
      if (!answer) return false;
      paid = { xp: { ...answer } };
    }
    const patch = Object.fromEntries(
      plan.lines.map((line) => [line.key, line.to]),
    ) as Partial<FullSheet>;
    // Les points ne sont vidés qu'une fois les nouvelles valeurs affichées :
    // l'aperçu ne revient pas en arrière entre les deux.
    const ok = await save(patch, paid, () => pointsDraft.setDraft(EMPTY_DRAFT));
    if (!ok) pointsDraft.setDraft(pending);
    return ok;
  }, [sheet, pointsDraft, plan, dialogs, isAdmin, save]);

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
        const saved = await request<Fields>('POST', `${url}/${collection}`, {
          ...data,
          ...paid,
        });
        const { entries, rest } = splitEntries(saved);
        const created = rest as CollectionItem<K>;
        await apply((current) => ({
          ...withEntries(current, entries),
          [collection]: [...current[collection], created],
        }));
        return created;
      } catch (e) {
        notifyError(e);
        return null;
      }
    },
    [apply, changeForNew, notifyError, payFor, url],
  );

  const updateItem = useCallback(
    async <K extends CollectionKey>(
      collection: K,
      itemId: string,
      patch: ItemPatch<K>,
    ) => {
      const fields = patch as Fields;
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
      const replace =
        (values: (item: Item) => Fields) =>
        (current: FullSheet): FullSheet => ({
          ...current,
          [collection]: (current[collection] as Item[]).map((i) =>
            i.id === itemId ? { ...i, ...values(i) } : i,
          ),
        });
      const optimistic = scalarPart(fields);
      let previous: Fields = {};
      await apply(
        replace((item) => {
          previous = previousValues(item, optimistic);
          return optimistic;
        }),
      );
      try {
        const saved = await request<Fields>(
          'PATCH',
          `${url}/${collection}/${itemId}`,
          { ...fields, ...paid },
        );
        const { entries, rest } = splitEntries(saved);
        await apply((current) =>
          withEntries(replace(() => confirmed(rest, fields))(current), entries),
        );
        return true;
      } catch (e) {
        await fail(
          e,
          replace(() => previous),
        );
        return false;
      }
    },
    [apply, fail, payFor, sheet, url],
  );

  const deleteItem = useCallback(
    async (collection: CollectionKey, itemId: string) => {
      const paid = await payFor(changeForRemoval(collection, itemId));
      if (!paid) return false;
      const query = paid.xp?.refund === false ? '?refund=false' : '';
      let removed: { item: Item; index: number } | null = null;
      await apply((current) => {
        const list = current[collection] as Item[];
        const index = list.findIndex((i) => i.id === itemId);
        if (index >= 0) removed = { item: list[index], index };
        return {
          ...current,
          [collection]: list.filter((i) => i.id !== itemId),
        };
      });
      try {
        const saved = await request<Fields | null>(
          'DELETE',
          `${url}/${collection}/${itemId}${query}`,
        );
        const { entries } = splitEntries(saved);
        if (entries.length) {
          await apply((current) => withEntries(current, entries));
        }
        return true;
      } catch (e) {
        await fail(e, (current) => {
          if (!removed) return current;
          const list = [...(current[collection] as Item[])];
          list.splice(Math.min(removed.index, list.length), 0, removed.item);
          return { ...current, [collection]: list };
        });
        return false;
      }
    },
    [apply, changeForRemoval, fail, payFor, url],
  );

  /**
   * Actions d'XP : elles renvoient seulement ce qu'elles changent (parties
   * débloquées et journal).
   */
  const xpAction = useCallback(
    async (path: string, body?: unknown, success?: string) => {
      try {
        const state = await request<Pick<FullSheet, 'unlocked' | 'xpEntries'>>(
          'POST',
          `${url}/xp${path}`,
          body,
        );
        await apply((current) => ({ ...current, ...state }));
        if (success) enqueueSnackbar(success, { variant: 'success' });
        return true;
      } catch (e) {
        notifyError(e);
        return false;
      }
    },
    [apply, url, notifyError, enqueueSnackbar],
  );

  /** MJ : retire une attribution (tout de suite à l'écran). */
  const deleteGrant = useCallback(
    async (entryId: string) => {
      let removed: { entry: Entry; index: number } | null = null;
      await apply((current) => {
        const index = current.xpEntries.findIndex((e) => e.id === entryId);
        if (index >= 0) removed = { entry: current.xpEntries[index], index };
        return {
          ...current,
          xpEntries: current.xpEntries.filter((e) => e.id !== entryId),
        };
      });
      try {
        await request('DELETE', `${url}/xp/${entryId}`);
        return true;
      } catch (e) {
        await fail(e, (current) => {
          if (!removed) return current;
          const xpEntries = [...current.xpEntries];
          xpEntries.splice(
            Math.min(removed.index, xpEntries.length),
            0,
            removed.entry,
          );
          return { ...current, xpEntries };
        });
        return false;
      }
    },
    [apply, fail, url],
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
    base,
    xp,
    xpPreview,
    error,
    isLoading,
    canEdit,
    isAdmin,
    isLocked,
    update,
    /** Points en attente sur les caractères. */
    points: {
      plan,
      draft,
      bounds,
      step: stepPoints,
      clear: clearPoints,
      commit: commitPoints,
    },
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
