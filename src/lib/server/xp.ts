import prisma from '@/lib/db/prisma';
import { XP_ENTRIES_ARGS } from '@/lib/db/sheet';
import { HttpError } from '@/lib/server/errors';
import { CharacteristicKey } from '@/lib/rules';
import {
  addLostPoints,
  clearLostPoints,
  LostPoints,
  lostPointsOf,
} from '@/lib/rules/lost';
import {
  ALL_SCOPES,
  Amounts,
  CHARACTERISTIC_MAX,
  buildLedger,
  checkSplit,
  investedIn,
  isScope,
  LEGACY,
  offeredTo,
  peekRemoval,
  planPoints,
  PointsInput,
  POOLS,
  recordRemoval,
  SCOPE_BY_KEY,
  Scope,
  sheetElements,
  sum,
  suggestSplit,
  XpChange,
  xpSummary,
  xpTotals,
} from '@/lib/rules/xp';
import { INT_LIMIT } from '@/lib/sheet/fields';
import { Prisma, Role } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export type Tx = Prisma.TransactionClient;

export interface Actor {
  id: string;
  role: Role;
}

const isAdmin = (actor: Actor) => actor.role === 'ADMIN';

/** Paiement joint à une modification de la fiche (champ `xp` du corps). */
export interface XpPayload {
  /** Répartition choisie ; sinon, la répartition proposée. */
  split?: Amounts;
  /** Points des caractères : répartition choisie pour chaque partie. */
  splits?: Partial<Record<Scope, Amounts>>;
  /** MJ : l'élément est offert. */
  gift?: boolean;
  /** MJ, pour une baisse ou un retrait : rembourser (par défaut) ou non. */
  refund?: boolean;
}

const toInt = (value: unknown, label: string) => {
  const number = Number(value ?? 0);
  if (!Number.isInteger(number)) {
    throw new HttpError(400, `Montant invalide en ${label}.`);
  }
  // Au-delà, la base refuse l'écriture (int4).
  if (Math.abs(number) > INT_LIMIT) {
    throw new HttpError(400, `Montant trop grand en ${label}.`);
  }
  return number;
};

const readAmounts = (raw: Record<string, unknown>): Amounts =>
  Object.fromEntries(
    POOLS.map((p) => [p.key, toInt(raw[p.key], p.label)]),
  ) as Amounts;

const readSplits = (raw: unknown): XpPayload['splits'] => {
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    throw new HttpError(400, 'Répartition invalide.');
  }
  return Object.fromEntries(
    Object.entries(raw).map(([scope, amounts]) => {
      if (!isScope(scope) || !amounts || typeof amounts !== 'object') {
        throw new HttpError(400, 'Répartition invalide.');
      }
      return [scope, readAmounts(amounts as Record<string, unknown>)];
    }),
  );
};

export const readXpPayload = (body: unknown): XpPayload => {
  const xp =
    body && typeof body === 'object'
      ? (body as { xp?: unknown }).xp
      : undefined;
  if (xp === undefined || xp === null) return {};
  if (typeof xp !== 'object' || Array.isArray(xp)) {
    throw new HttpError(400, 'Paiement invalide.');
  }
  const raw = xp as Record<string, unknown>;
  return {
    split: POOLS.some((p) => raw[p.key] !== undefined)
      ? readAmounts(raw)
      : undefined,
    splits: readSplits(raw.splits),
    gift: raw.gift === true,
    refund: raw.refund === undefined ? undefined : raw.refund !== false,
  };
};

/**
 * Ce que l'XP change sur une fiche : parties débloquées et journal. Renvoyé
 * par la validation, le reset et l'attribution, pour ne pas recharger toute
 * la fiche.
 */
export const readXpState = async (db: Tx, sheetId: string) => {
  const state = await db.sheet.findUnique({
    where: { id: sheetId },
    select: { unlocked: true, xpEntries: XP_ENTRIES_ARGS },
  });
  if (!state) throw new HttpError(404, 'Fiche introuvable.');
  return state;
};

/** Une seule modification à la fois par fiche (deux achats simultanés…). */
export const lockSheet = async (tx: Tx, sheetId: string) => {
  const rows = await tx.$queryRaw<
    unknown[]
  >`SELECT 1 FROM "Sheet" WHERE "id" = ${sheetId} FOR UPDATE`;
  if (rows.length === 0) throw new HttpError(404, 'Fiche introuvable.');
};

const ENTRY_SELECT = {
  kind: true,
  feel: true,
  learn: true,
  live: true,
  offered: true,
  target: true,
  scope: true,
  seq: true,
} satisfies Prisma.XpEntrySelect;

/** Une écriture telle qu'elle figure dans le journal de la fiche. */
const ENTRY_AUTHOR = XP_ENTRIES_ARGS.include;

/**
 * Enregistre le coût d'un changement de la fiche : achat (ou cadeau du MJ)
 * s'il est positif, remboursement (ou perte) s'il est négatif. Rien n'est
 * enregistré quand la partie concernée est débloquée : son coût sera payé à
 * la validation.
 *
 * À appeler dans une transaction, après `lockSheet`. Renvoie l'écriture
 * ajoutée au journal (avec son auteur), que l'API renvoie au client.
 */
export const chargeChange = async (
  tx: Tx,
  sheetId: string,
  change: XpChange & { target: string },
  actor: Actor,
  payload: XpPayload,
) => {
  const sheet = await tx.sheet.findUnique({
    where: { id: sheetId },
    select: { unlocked: true, xpEntries: { select: ENTRY_SELECT } },
  });
  if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
  if (sheet.unlocked.includes(change.scope) || change.delta === 0) return null;

  const base = {
    sheetId,
    authorId: actor.id,
    target: change.target,
    scope: change.scope,
    label: change.label,
  };

  if (change.delta > 0) {
    if (payload.gift) {
      if (!isAdmin(actor)) {
        throw new HttpError(403, 'Seul le MJ peut offrir un élément.');
      }
      return tx.xpEntry.create({
        data: { ...base, kind: 'GIFT', offered: change.delta },
        include: ENTRY_AUTHOR,
      });
    }
    const balance = xpTotals(sheet.xpEntries).left;
    const suggestion = suggestSplit(change.delta, change.scope, balance);
    if (!payload.split && suggestion.missing > 0) {
      const pools = SCOPE_BY_KEY[change.scope].pools
        .map((p) => POOLS.find((pool) => pool.key === p).label)
        .join(' ou ');
      throw new HttpError(
        400,
        `${change.label} (${change.delta} XP) : XP insuffisante, il manque ${suggestion.missing} XP (${pools}).`,
      );
    }
    const split = payload.split ?? suggestion.split;
    const error = checkSplit(split, change.delta, change.scope, balance);
    if (error) {
      throw new HttpError(
        400,
        `${change.label} (${change.delta} XP) : ${error}`,
      );
    }
    return tx.xpEntry.create({
      data: { ...base, kind: 'SPEND', ...split },
      include: ENTRY_AUTHOR,
    });
  }

  if (!isAdmin(actor)) {
    throw new HttpError(
      403,
      `${SCOPE_BY_KEY[change.scope].label} est validé : seul le MJ peut baisser ou retirer ce qui a été acquis.`,
    );
  }
  const { taken } = peekRemoval(
    buildLedger(sheet.xpEntries),
    change.target,
    -change.delta,
  );
  return tx.xpEntry.create({
    include: ENTRY_AUTHOR,
    data: {
      ...base,
      kind: payload.refund === false ? 'LOSS' : 'REFUND',
      feel: taken.feel,
      learn: taken.learn,
      live: taken.live,
      offered: taken.offered,
    },
  });
};

/**
 * Enregistre ce que coûtent les points ajoutés (ou retirés) aux caractères :
 * reprises du MJ d'abord, puis achats (ou cadeaux du MJ), une écriture par
 * caractère. Rien pour une partie débloquée.
 *
 * Une baisse du MJ sans remboursement raye les points : ils sont renvoyés
 * dans `struck`, à ajouter à la rature de la fiche (`lostPoints`).
 *
 * À appeler dans une transaction, après `lockSheet`. Renvoie les écritures
 * ajoutées au journal (avec leur auteur), que l'API renvoie au client.
 */
export const chargePoints = async (
  tx: Tx,
  sheetId: string,
  { current, target }: Pick<PointsInput, 'current' | 'target'>,
  actor: Actor,
  payload: XpPayload,
  { restore = false }: { restore?: boolean } = {},
): Promise<{
  entries: Prisma.XpEntryGetPayload<{ include: typeof ENTRY_AUTHOR }>[];
  struck: LostPoints;
}> => {
  const sheet = await tx.sheet.findUnique({
    where: { id: sheetId },
    select: { unlocked: true, xpEntries: { select: ENTRY_SELECT } },
  });
  if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
  const plan = planPoints(
    { current, target, unlocked: sheet.unlocked, entries: sheet.xpEntries },
    { splits: payload.splits, gift: payload.gift, refund: payload.refund },
  );
  if (!isAdmin(actor)) {
    const lowered = plan.removals[0]?.line;
    if (lowered) {
      throw new HttpError(
        403,
        `${SCOPE_BY_KEY[lowered.scope].label} est validé : seul le MJ peut baisser ou retirer ce qui a été acquis.`,
      );
    }
    if (payload.gift && plan.purchases.length) {
      throw new HttpError(403, 'Seul le MJ peut offrir un élément.');
    }
  }
  if (plan.error) throw new HttpError(400, plan.error);

  const struck: LostPoints =
    payload.refund === false
      ? Object.fromEntries(
          plan.removals.map(({ line }) => [line.key, line.from - line.to]),
        )
      : {};
  const base = (
    line: { target: string; scope: Scope; label: string },
    tag?: string,
  ) => ({
    sheetId,
    authorId: actor.id,
    target: line.target,
    scope: line.scope,
    label: tag ? `${line.label} (${tag})` : line.label,
  });
  const data: Prisma.XpEntryCreateManyInput[] = [
    ...plan.removals.map(({ line, taken }) => ({
      ...base(line, payload.refund === false ? 'points rayés' : undefined),
      kind: payload.refund === false ? ('LOSS' as const) : ('REFUND' as const),
      feel: taken.feel,
      learn: taken.learn,
      live: taken.live,
      offered: taken.offered,
    })),
    ...plan.purchases.map(({ line, split }) => {
      const tag = restore ? 'points rétablis' : undefined;
      return payload.gift
        ? { ...base(line, tag), kind: 'GIFT' as const, offered: line.delta }
        : { ...base(line, tag), kind: 'SPEND' as const, ...split };
    }),
  ];
  if (data.length === 0) return { entries: [], struck };
  // Plusieurs caractères : regroupés dans l'historique.
  const batch = data.length > 1 ? `points:${randomUUID()}` : null;
  await tx.xpEntry.createMany({ data: data.map((e) => ({ ...e, batch })) });
  // La fiche est verrouillée : ses dernières écritures sont celles-ci.
  const added = await tx.xpEntry.findMany({
    where: { sheetId },
    orderBy: { seq: 'desc' },
    take: data.length,
    include: ENTRY_AUTHOR,
  });
  return { entries: added.reverse(), struck };
};

/** La rature des points de la fiche, avec les points rayés en plus. */
export const withStruckPoints = (
  lostPoints: unknown,
  struck: LostPoints,
): Prisma.InputJsonValue => addLostPoints(lostPointsOf(lostPoints), struck);

/**
 * Le MJ rétablit les points rayés d'une caractéristique : ils reviennent
 * (offerts, ou rachetés avec l'XP du personnage) et la rature s'efface.
 */
export const restorePoints = async (
  tx: Tx,
  sheetId: string,
  key: CharacteristicKey,
  actor: Actor,
  payload: XpPayload,
) => {
  if (!isAdmin(actor)) {
    throw new HttpError(403, 'Seul le MJ peut rétablir des points rayés.');
  }
  await lockSheet(tx, sheetId);
  const current = await tx.sheet.findUnique({ where: { id: sheetId } });
  if (!current) throw new HttpError(404, 'Fiche introuvable.');
  const lost = lostPointsOf(current.lostPoints);
  const points = lost[key] ?? 0;
  if (!points) throw new HttpError(400, 'Aucun point rayé à rétablir.');
  const value = Math.min(CHARACTERISTIC_MAX, (current[key] ?? 0) + points);
  const { entries } = await chargePoints(
    tx,
    sheetId,
    { current, target: { [key]: value } },
    actor,
    payload,
    { restore: true },
  );
  const rest = clearLostPoints(lost, [key]);
  const sheet = await tx.sheet.update({
    where: { id: sheetId },
    data: {
      [key]: value,
      lostPoints: Object.keys(rest).length ? rest : Prisma.DbNull,
    },
  });
  return entries.length ? { ...sheet, addedXpEntries: entries } : sheet;
};

/* -------------------------------------------------------------------------- */
/*                     Attribution, validation et reset                       */
/* -------------------------------------------------------------------------- */

/** Ce qu'il faut de la fiche pour calculer son coût. */
const XP_SHEET_SELECT = {
  id: true,
  unlocked: true,
  strength: true,
  agility: true,
  vivacity: true,
  vigour: true,
  thinking: true,
  perception: true,
  concentration: true,
  understanding: true,
  charisma: true,
  empathy: true,
  ego: true,
  will: true,
  corpus: { select: { id: true } },
  skills: {
    select: {
      id: true,
      skill: {
        select: { name: true, category: true, type: true, degree: true },
      },
    },
  },
  spyree: {
    select: { id: true, level: true, potential: { select: { name: true } } },
  },
  xpEntries: { select: ENTRY_SELECT },
} satisfies Prisma.SheetSelect;

const loadForXp = async (tx: Tx, sheetId: string) => {
  const sheet = await tx.sheet.findUnique({
    where: { id: sheetId },
    select: XP_SHEET_SELECT,
  });
  if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
  return sheet;
};

export interface Grant {
  label: string;
  amounts: Amounts;
}

export const readGrant = (body: unknown): Grant => {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Données invalides.');
  }
  const raw = body as Record<string, unknown>;
  const amounts = readAmounts(raw);
  if (POOLS.every((p) => amounts[p.key] === 0)) {
    throw new HttpError(400, 'Aucune XP à attribuer.');
  }
  const label = String(raw.label ?? '').trim() || 'Attribution du MJ';
  return { label: label.slice(0, 200), amounts };
};

export const grantXp = (
  tx: Tx,
  sheetIds: string[],
  actor: Actor,
  { label, amounts }: Grant,
) => {
  const batch = sheetIds.length > 1 ? `grant:${randomUUID()}` : null;
  return tx.xpEntry.createMany({
    data: sheetIds.map((sheetId) => ({
      sheetId,
      authorId: actor.id,
      kind: 'GAIN' as const,
      label,
      batch,
      ...amounts,
    })),
  });
};

const describeMissing = (missing: Partial<Record<Scope, number>>) =>
  Object.entries(missing)
    .map(([scope, amount]) => `${amount} XP pour ${SCOPE_BY_KEY[scope].label}`)
    .join(', ');

/**
 * Valide les parties débloquées : leur coût est payé (répartition proposée)
 * et elles ne se modifient plus librement.
 */
export const validateSheet = async (tx: Tx, sheetId: string, actor: Actor) => {
  await lockSheet(tx, sheetId);
  const sheet = await loadForXp(tx, sheetId);
  const summary = xpSummary(sheet);
  if (summary.unlocked.length === 0) {
    throw new HttpError(400, 'La fiche est déjà validée.');
  }
  if (!summary.allocation.feasible) {
    throw new HttpError(
      400,
      `XP insuffisante pour valider : il manque ${describeMissing(summary.missingByScope)}.`,
    );
  }

  const batch = `validation:${randomUUID()}`;
  const data: Prisma.XpEntryCreateManyInput[] = summary.dues.map(
    (due, index) => ({
      sheetId,
      authorId: actor.id,
      kind: 'SPEND',
      ...summary.allocation.splits[index],
      target: due.target,
      scope: due.scope,
      label: due.label,
      batch,
    }),
  );

  // Ce qui avait été offert à un élément retiré ou baissé entre-temps.
  const ledger = buildLedger(sheet.xpEntries);
  const elements = new Map(sheetElements(sheet).map((e) => [e.target, e]));
  for (const target of ledger.stacks.keys()) {
    const scope = ledger.scopes.get(target);
    if (target === LEGACY || !scope || !summary.unlocked.includes(scope)) {
      continue;
    }
    const element = elements.get(target);
    const held = sum(investedIn(ledger, target)) + offeredTo(ledger, target);
    const excess = held - (element?.cost ?? 0);
    if (excess <= 0) continue;
    const { taken } = peekRemoval(ledger, target, excess);
    data.push({
      sheetId,
      authorId: actor.id,
      kind: 'LOSS',
      ...taken,
      target,
      scope,
      label: element ? `${element.label} (surplus offert)` : 'Élément retiré',
      batch,
    });
  }

  await tx.xpEntry.createMany({ data });
  await tx.sheet.update({ where: { id: sheetId }, data: { unlocked: [] } });
};

export const readScopes = (body: unknown): Scope[] => {
  const scopes = (body as { scopes?: unknown })?.scopes;
  if (!Array.isArray(scopes) || scopes.length === 0) {
    throw new HttpError(400, 'Choisir au moins une partie de la fiche.');
  }
  if (!scopes.every(isScope)) throw new HttpError(400, 'Partie inconnue.');
  return ALL_SCOPES.filter((s) => scopes.includes(s));
};

/**
 * Reset accordé par le MJ : l'XP payée pour ces parties de la fiche est
 * rendue dans ses catégories et elles redeviennent modifiables librement,
 * jusqu'à la prochaine validation. Ce qui avait été offert le reste.
 */
export const resetSheet = async (
  tx: Tx,
  sheetId: string,
  actor: Actor,
  scopes: Scope[],
) => {
  await lockSheet(tx, sheetId);
  const sheet = await loadForXp(tx, sheetId);
  const locked = scopes.filter((s) => !sheet.unlocked.includes(s));
  const ledger = buildLedger(sheet.xpEntries);
  const batch = `reset:${randomUUID()}`;
  const data: Prisma.XpEntryCreateManyInput[] = [];

  const refund = (
    target: string,
    scope: string | null,
    label: string,
    amount: number,
  ) => {
    const { taken } = peekRemoval(ledger, target, amount, { paidOnly: true });
    if (sum(taken) <= 0) return;
    recordRemoval(ledger, target, taken);
    data.push({
      sheetId,
      authorId: actor.id,
      kind: 'REFUND',
      feel: taken.feel,
      learn: taken.learn,
      live: taken.live,
      target,
      scope,
      label,
      batch,
    });
  };

  // Chaque élément rend ce qu'il vaut (hors cadeau), au besoin pris sur les
  // dépenses non détaillées de l'ancienne fiche…
  for (const e of sheetElements(sheet)) {
    if (!locked.includes(e.scope)) continue;
    refund(e.target, e.scope, e.label, e.cost - offeredTo(ledger, e.target));
  }
  // … puis ce qui aurait été payé en trop.
  for (const target of [...ledger.stacks.keys()]) {
    const scope = ledger.scopes.get(target);
    if (target === LEGACY || !scope || !locked.includes(scope)) continue;
    refund(target, scope, 'Reliquat', sum(investedIn(ledger, target)));
  }
  // Reset complet : tout ce qui reste de l'ancienne fiche.
  const unlocked = ALL_SCOPES.filter(
    (s) => scopes.includes(s) || sheet.unlocked.includes(s),
  );
  if (unlocked.length === ALL_SCOPES.length) {
    refund(
      LEGACY,
      null,
      'Dépenses antérieures (ancienne fiche)',
      sum(investedIn(ledger, LEGACY)),
    );
  }

  if (data.length) await tx.xpEntry.createMany({ data });
  await tx.sheet.update({ where: { id: sheetId }, data: { unlocked } });
};

/** Supprime une attribution d'XP (en une requête quand tout va bien). */
export const deleteGrant = async (sheetId: string, entryId: string) => {
  const { count } = await prisma.xpEntry.deleteMany({
    where: { id: entryId, sheetId, kind: 'GAIN' },
  });
  if (count) return;
  const entry = await prisma.xpEntry.findFirst({
    where: { id: entryId, sheetId },
    select: { id: true },
  });
  if (!entry) throw new HttpError(404, 'Écriture introuvable.');
  throw new HttpError(
    400,
    "Seules les attributions d'XP peuvent être supprimées : pour un achat, retirer l'élément ou faire un reset.",
  );
};
