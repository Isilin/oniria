/**
 * L'expérience d'Oniria.
 *
 * - Trois catégories : Éprouver, Apprendre et Vivre. Chaque partie de la
 *   fiche (un « périmètre ») ne peut être payée qu'avec certaines d'entre
 *   elles ; Vivre paie tout. Une dépense peut combiner plusieurs catégories.
 * - Coûts : caractéristiques (1, 2, 4 puis 8 XP par point), compétences
 *   (selon leur degré), Corpus (5 XP le 1er aspect, 10 le 2e, 15 le 3e…),
 *   Spyrée (prix de chaque passage de rang).
 * - Tout est consigné dans un journal : XP attribuée par le MJ, achats,
 *   remboursements, XP perdue, éléments offerts.
 * - Un élément rayé par le MJ (voir lost.ts) reste sur la fiche mais ne
 *   compte plus dans sa valeur : l'XP payée pour lui est perdue.
 * - Un périmètre « débloqué » (création ou reset du MJ) se modifie
 *   librement : son coût est calculé d'après la fiche et n'est payé qu'à la
 *   validation. Un périmètre validé ne fait que des achats ; baisser ou
 *   retirer y est réservé au MJ (avec remboursement ou perte).
 *
 * Pour savoir quoi rembourser, chaque élément de la fiche (une
 * caractéristique, une compétence, le Corpus, un potentiel) garde une pile
 * de « couches » : ce qui a été payé (par catégorie) et ce qui a été offert.
 * On rembourse la dernière couche en premier. Les dépenses d'une fiche
 * reprise de l'ancienne version (« legacy ») ne sont pas détaillées : elles
 * servent de réserve quand un élément n'a pas de couche à lui.
 *
 * Fonctions pures, partagées entre le client et le serveur.
 */

import type { SKILL_DEGREES, SKILL_TYPES } from '@/lib/sheet/fields';
import {
  CHARACTERISTIC_BY_KEY,
  CHARACTERISTICS,
  characteristicCost,
  CharacteristicKey,
  toRoman,
} from '.';
import { activeOnly, isLost, Strikable } from './lost';

/* -------------------------------------------------------------------------- */
/*                                Catégories                                  */
/* -------------------------------------------------------------------------- */

export type Pool = 'feel' | 'learn' | 'live';
export type Amounts = Record<Pool, number>;

export const POOLS: { key: Pool; label: string; description: string }[] = [
  {
    key: 'feel',
    label: 'Éprouver',
    description: 'Corps et Âme, compétences martiales et générales, le Corpus.',
  },
  {
    key: 'learn',
    label: 'Apprendre',
    description: 'Esprit et Âme, compétences spyrales et générales, la Spyrée.',
  },
  { key: 'live', label: 'Vivre', description: 'Tout.' },
];

export const POOL_LABELS = Object.fromEntries(
  POOLS.map((p) => [p.key, p.label]),
) as Record<Pool, string>;

export const zero = (): Amounts => ({ feel: 0, learn: 0, live: 0 });

export const sum = (a: Amounts) => a.feel + a.learn + a.live;

const add = (a: Amounts, b: Amounts): Amounts => ({
  feel: a.feel + b.feel,
  learn: a.learn + b.learn,
  live: a.live + b.live,
});

const sub = (a: Amounts, b: Amounts): Amounts => ({
  feel: a.feel - b.feel,
  learn: a.learn - b.learn,
  live: a.live - b.live,
});

/* -------------------------------------------------------------------------- */
/*                                Périmètres                                  */
/* -------------------------------------------------------------------------- */

export type Scope =
  | 'body'
  | 'spirit'
  | 'soul'
  | 'general'
  | 'spyral'
  | 'martial'
  | 'corpus'
  | 'spyree';

export interface ScopeInfo {
  key: Scope;
  label: string;
  /** Catégories d'XP qui peuvent payer ce périmètre. */
  pools: Pool[];
}

export const SCOPES: ScopeInfo[] = [
  { key: 'body', label: 'Le Corps', pools: ['feel', 'live'] },
  { key: 'spirit', label: "L'Esprit", pools: ['learn', 'live'] },
  { key: 'soul', label: "L'Âme", pools: ['feel', 'learn', 'live'] },
  {
    key: 'general',
    label: 'Compétences générales',
    pools: ['feel', 'learn', 'live'],
  },
  { key: 'spyral', label: 'Compétences spyrales', pools: ['learn', 'live'] },
  { key: 'martial', label: 'Compétences martiales', pools: ['feel', 'live'] },
  { key: 'corpus', label: 'Le Corpus', pools: ['feel', 'live'] },
  { key: 'spyree', label: 'La Spyrée', pools: ['learn', 'live'] },
];

export const ALL_SCOPES = SCOPES.map((s) => s.key);

export const SCOPE_BY_KEY = Object.fromEntries(
  SCOPES.map((s) => [s.key, s]),
) as Record<Scope, ScopeInfo>;

export const isScope = (value: unknown): value is Scope =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(SCOPE_BY_KEY, value);

type SkillType = (typeof SKILL_TYPES)[number];
type SkillDegree = (typeof SKILL_DEGREES)[number];

export const skillScope = (type: SkillType): Scope =>
  type.toLowerCase() as Scope;

export const characteristicScope = (key: CharacteristicKey): Scope =>
  CHARACTERISTIC_BY_KEY[key].group;

/* -------------------------------------------------------------------------- */
/*                                   Coûts                                    */
/* -------------------------------------------------------------------------- */

export const CHARACTERISTIC_MIN = 0;
export const CHARACTERISTIC_MAX = 100;

export const SKILL_COSTS: Record<SkillDegree, number> = {
  BASE: 10,
  PRINCIPLE: 10,
  MASTERY: 30,
  TECHNIQUE: 10,
  SEQUENCE: 20,
};

/** Prix d'un aspect du Corpus selon son rang : 5, 10, 15… */
export const corpusAspectCost = (rank: number) => 5 * rank;

/** Coût total de `count` aspects du Corpus : 5 + 10 + 15… */
export const corpusCost = (count: number) =>
  (5 * Math.max(0, count) * (Math.max(0, count) + 1)) / 2;

/** Prix du passage à chaque rang de la Spyrée (I, II, III, IV, V). */
export const SPYREE_STEPS = [10, 30, 70, 150, 310];
export const SPYREE_MAX = SPYREE_STEPS.length;

/** Coût total d'un potentiel à ce rang (rang V : 570). */
export const spyreeCost = (level: number | null | undefined) =>
  SPYREE_STEPS.slice(
    0,
    Math.min(SPYREE_MAX, Math.max(0, Math.trunc(level ?? 0))),
  ).reduce((total, step) => total + step, 0);

/* -------------------------------------------------------------------------- */
/*                              Cibles du journal                             */
/* -------------------------------------------------------------------------- */

/** Dépenses de l'ancienne fiche, non détaillées. */
export const LEGACY = 'legacy';
export const CORPUS_TARGET = 'corpus';
export const charTarget = (key: CharacteristicKey) => `char:${key}`;
export const skillTarget = (id: string) => `skill:${id}`;
export const spyreeTarget = (id: string) => `spyree:${id}`;

const scopeOfTarget = (target: string): Scope | null => {
  if (target === CORPUS_TARGET) return 'corpus';
  if (target.startsWith('spyree:')) return 'spyree';
  if (target.startsWith('char:')) {
    const key = target.slice(5) as CharacteristicKey;
    return CHARACTERISTIC_BY_KEY[key]?.group ?? null;
  }
  return null;
};

/** Nom d'une compétence (une base « - » désigne la catégorie elle-même). */
export const skillLabel = (skill: { name: string; category: string }) =>
  skill.name === '-' ? skill.category : skill.name;

/* -------------------------------------------------------------------------- */
/*                                  Journal                                   */
/* -------------------------------------------------------------------------- */

export type XpKind = 'GAIN' | 'SPEND' | 'REFUND' | 'LOSS' | 'GIFT';

export interface XpEntryInput {
  kind: XpKind;
  feel: number;
  learn: number;
  live: number;
  /** Valeur offerte (GIFT) ou reprise sur ce qui avait été offert. */
  offered: number;
  target?: string | null;
  scope?: string | null;
  /** Ordre d'écriture. */
  seq?: number;
}

export interface XpTotals {
  /** XP attribuée par le MJ (moins ce qu'il a retiré). */
  gained: Amounts;
  /** XP dépensée (achats moins remboursements), XP perdue comprise. */
  spent: Amounts;
  /** Part de l'XP dépensée qui a été perdue (élément rayé ou retiré). */
  lost: Amounts;
  /** XP restante. */
  left: Amounts;
}

export const amountsOf = (e: Pick<XpEntryInput, Pool>): Amounts => ({
  feel: e.feel ?? 0,
  learn: e.learn ?? 0,
  live: e.live ?? 0,
});

export const xpTotals = (entries: XpEntryInput[]): XpTotals => {
  let gained = zero();
  let spent = zero();
  let lost = zero();
  for (const entry of entries) {
    if (entry.kind === 'GAIN') gained = add(gained, amountsOf(entry));
    if (entry.kind === 'SPEND') spent = add(spent, amountsOf(entry));
    if (entry.kind === 'REFUND') spent = sub(spent, amountsOf(entry));
    if (entry.kind === 'LOSS') lost = add(lost, amountsOf(entry));
  }
  return { gained, spent, lost, left: sub(gained, spent) };
};

export interface Layer extends Amounts {
  offered: number;
}

const emptyLayer = (): Layer => ({ feel: 0, learn: 0, live: 0, offered: 0 });

const paidOf = (layer: Layer) => layer.feel + layer.learn + layer.live;

/** On reprend Vivre en premier : c'est la catégorie payée en dernier. */
const REFUND_ORDER: Pool[] = ['live', 'learn', 'feel'];

export interface Ledger {
  stacks: Map<string, Layer[]>;
  scopes: Map<string, Scope>;
}

const stacksFor = (ledger: Ledger, target: string) => {
  const own = ledger.stacks.get(target) ?? [];
  if (target === LEGACY) return [own];
  return [own, ledger.stacks.get(LEGACY) ?? []];
};

/**
 * Ce que coûterait de retirer `amount` XP de valeur à un élément : on prend
 * ses couches de la plus récente à la plus ancienne (puis les dépenses non
 * détaillées de l'ancienne fiche). Ne modifie rien.
 */
export const peekRemoval = (
  ledger: Ledger,
  target: string,
  amount: number,
  { paidOnly = false }: { paidOnly?: boolean } = {},
): { taken: Layer; missing: number } => {
  const taken = emptyLayer();
  let rest = Math.max(0, amount);
  for (const stack of stacksFor(ledger, target)) {
    for (let i = stack.length - 1; i >= 0 && rest > 0; i--) {
      const layer = stack[i];
      if (!paidOnly) {
        const t = Math.min(layer.offered, rest);
        taken.offered += t;
        rest -= t;
      }
      for (const pool of REFUND_ORDER) {
        const t = Math.min(layer[pool], rest);
        taken[pool] += t;
        rest -= t;
      }
    }
  }
  return { taken, missing: rest };
};

/** Retire des couches ce qui a été pris (même ordre que `peekRemoval`). */
const applyRemoval = (ledger: Ledger, target: string, taken: Layer) => {
  let paid = Math.max(0, paidOf(taken));
  let offered = Math.max(0, taken.offered);
  for (const stack of stacksFor(ledger, target)) {
    for (let i = stack.length - 1; i >= 0; i--) {
      const layer = stack[i];
      const t = Math.min(layer.offered, offered);
      layer.offered -= t;
      offered -= t;
      for (const pool of REFUND_ORDER) {
        const p = Math.min(layer[pool], paid);
        layer[pool] -= p;
        paid -= p;
      }
      if (paidOf(layer) + layer.offered <= 0) stack.splice(i, 1);
    }
  }
};

/** Rejoue le journal pour obtenir les couches de chaque élément. */
export const buildLedger = (entries: XpEntryInput[]): Ledger => {
  const ledger: Ledger = { stacks: new Map(), scopes: new Map() };
  const sorted = [...entries].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
  for (const entry of sorted) {
    if (entry.kind === 'GAIN') continue;
    const target = entry.target ?? LEGACY;
    const scope = isScope(entry.scope) ? entry.scope : scopeOfTarget(target);
    if (scope) ledger.scopes.set(target, scope);
    const layer: Layer = {
      feel: Math.max(0, entry.feel ?? 0),
      learn: Math.max(0, entry.learn ?? 0),
      live: Math.max(0, entry.live ?? 0),
      offered: Math.max(0, entry.offered ?? 0),
    };
    if (entry.kind === 'SPEND' || entry.kind === 'GIFT') {
      if (paidOf(layer) + layer.offered > 0) {
        ledger.stacks.set(target, [
          ...(ledger.stacks.get(target) ?? []),
          layer,
        ]);
      }
    } else {
      applyRemoval(ledger, target, layer);
    }
  }
  return ledger;
};

/** XP payée pour un élément (encore investie). */
export const investedIn = (ledger: Ledger, target: string): Amounts =>
  (ledger.stacks.get(target) ?? []).reduce(
    (total, layer) => add(total, layer),
    zero(),
  );

/** Valeur offerte à un élément. */
export const offeredTo = (ledger: Ledger, target: string) =>
  (ledger.stacks.get(target) ?? []).reduce(
    (total, layer) => total + layer.offered,
    0,
  );

/** Pour les écritures : retire du registre ce qu'une entrée vient de prendre. */
export const recordRemoval = applyRemoval;

/* -------------------------------------------------------------------------- */
/*                               Répartition                                  */
/* -------------------------------------------------------------------------- */

/**
 * Répartition proposée : les catégories propres au périmètre d'abord
 * (Éprouver puis Apprendre), Vivre en dernier.
 */
export const suggestSplit = (
  amount: number,
  scope: Scope,
  balance: Amounts,
): { split: Amounts; missing: number } => {
  const split = zero();
  let rest = Math.max(0, amount);
  const pools = SCOPE_BY_KEY[scope].pools;
  const order = [...pools.filter((p) => p !== 'live'), 'live' as const];
  for (const pool of order) {
    if (!pools.includes(pool)) continue;
    const t = Math.min(Math.max(0, balance[pool]), rest);
    split[pool] = t;
    rest -= t;
  }
  return { split, missing: rest };
};

/** Vérifie une répartition choisie ; renvoie un message d'erreur ou null. */
export const checkSplit = (
  split: Amounts,
  amount: number,
  scope: Scope,
  balance: Amounts,
): string | null => {
  const info = SCOPE_BY_KEY[scope];
  for (const pool of POOLS) {
    const value = split[pool.key];
    if (!Number.isInteger(value) || value < 0) {
      return `Montant invalide en ${pool.label}.`;
    }
    if (value > 0 && !info.pools.includes(pool.key)) {
      return `L'XP ${pool.label} ne peut pas payer ${info.label.toLowerCase()}.`;
    }
    if (value > balance[pool.key]) {
      return `Pas assez d'XP ${pool.label} (reste ${Math.max(0, balance[pool.key])}).`;
    }
  }
  if (sum(split) !== amount) {
    return `La répartition (${sum(split)}) doit faire ${amount} XP.`;
  }
  return null;
};

/** Les périmètres les plus contraints passent en premier. */
const restrictiveness = (scope: Scope) => SCOPE_BY_KEY[scope].pools.length;

export interface Due {
  target: string;
  scope: Scope;
  label: string;
  /** XP à payer à la validation. */
  amount: number;
}

export interface Allocation {
  /** Répartition de chaque dû (même ordre que les dus reçus). */
  splits: Amounts[];
  /** Ce qui manque pour chaque dû. */
  missing: number[];
  /** Total payé par catégorie. */
  total: Amounts;
  feasible: boolean;
}

/**
 * Répartit des dus sur l'XP restante en gardant Vivre pour la fin : les
 * périmètres payables par deux catégories passent avant ceux qui en
 * acceptent trois, ce qui garantit de trouver une répartition dès qu'il en
 * existe une.
 */
export const allocate = (dues: Due[], balance: Amounts): Allocation => {
  const remaining = { ...balance };
  const splits = dues.map(() => zero());
  const missing = dues.map(() => 0);
  const order = dues
    .map((due, index) => ({ due, index }))
    .sort(
      (a, b) =>
        restrictiveness(a.due.scope) - restrictiveness(b.due.scope) ||
        a.index - b.index,
    );
  for (const { due, index } of order) {
    const { split, missing: lack } = suggestSplit(
      due.amount,
      due.scope,
      remaining,
    );
    splits[index] = split;
    missing[index] = lack;
    for (const pool of POOLS) remaining[pool.key] -= split[pool.key];
  }
  const total = splits.reduce(add, zero());
  return { splits, missing, total, feasible: missing.every((m) => m === 0) };
};

/* -------------------------------------------------------------------------- */
/*                             Éléments d'une fiche                           */
/* -------------------------------------------------------------------------- */

/** Les listes d'une fiche qui coûtent de l'XP. */
export interface XpItemsInput {
  corpus?: (Strikable & { id?: string; name?: string | null })[];
  skills?: (Strikable & {
    id: string;
    skill: {
      name: string;
      category: string;
      type: SkillType;
      degree: SkillDegree;
    };
  })[];
  spyree?: (Strikable & {
    id: string;
    level?: number | null;
    potential?: { name: string } | null;
  })[];
}

export interface XpSheetInput
  extends Partial<Record<CharacteristicKey, number | null>>, XpItemsInput {
  unlocked?: string[] | null;
  xpEntries?: XpEntryInput[];
}

export interface Element {
  target: string;
  scope: Scope;
  /** Valeur en XP de l'élément tel qu'il est sur la fiche. */
  cost: number;
  label: string;
}

const value = (v: number | null | undefined) =>
  typeof v === 'number' && Number.isFinite(v) ? v : 0;

/** Les éléments de la fiche et leur valeur ; un élément rayé n'en a plus. */
export const sheetElements = (sheet: XpSheetInput): Element[] => {
  const corpusCount = activeOnly(sheet.corpus).length;
  return [
    ...CHARACTERISTICS.map((c) => ({
      target: charTarget(c.key),
      scope: c.group,
      cost: characteristicCost(value(sheet[c.key])),
      label: `${c.label} ${value(sheet[c.key])}`,
    })),
    ...activeOnly(sheet.skills).map((s) => ({
      target: skillTarget(s.id),
      scope: skillScope(s.skill.type),
      cost: SKILL_COSTS[s.skill.degree] ?? 0,
      label: `Compétence : ${skillLabel(s.skill)}`,
    })),
    {
      target: CORPUS_TARGET,
      scope: 'corpus' as const,
      cost: corpusCost(corpusCount),
      label: `Corpus : ${corpusCount} aspect${corpusCount > 1 ? 's' : ''}`,
    },
    ...activeOnly(sheet.spyree).map((s) => ({
      target: spyreeTarget(s.id),
      scope: 'spyree' as const,
      cost: spyreeCost(s.level),
      label: `Spyrée : ${s.potential?.name ?? '?'} ${toRoman(s.level)}`,
    })),
  ];
};

export const unlockedScopes = (sheet: XpSheetInput): Scope[] =>
  ALL_SCOPES.filter((s) => (sheet.unlocked ?? []).includes(s));

export interface XpSummary extends XpTotals {
  unlocked: Scope[];
  /** Ce qu'il faudra payer à la validation des périmètres débloqués. */
  dues: Due[];
  allocation: Allocation;
  /** XP restante une fois les dus payés. */
  afterValidation: Amounts;
  /** XP manquante, par périmètre, pour pouvoir valider. */
  missingByScope: Partial<Record<Scope, number>>;
  /**
   * Contrôle des périmètres validés : valeur de la fiche (`expected`) et XP
   * enregistrée pour elle (`recorded`, dont `legacy` non détaillée).
   */
  consistency: {
    expected: number;
    recorded: number;
    legacy: number;
    diff: number;
    byScope: Partial<Record<Scope, { expected: number; recorded: number }>>;
  };
}

export const xpSummary = (sheet: XpSheetInput): XpSummary => {
  const entries = sheet.xpEntries ?? [];
  const totals = xpTotals(entries);
  const ledger = buildLedger(entries);
  const unlocked = unlockedScopes(sheet);
  const elements = sheetElements(sheet);

  const dues = elements
    .filter((e) => unlocked.includes(e.scope))
    .map((e) => ({
      target: e.target,
      scope: e.scope,
      label: e.label,
      amount: Math.max(
        0,
        e.cost -
          offeredTo(ledger, e.target) -
          sum(investedIn(ledger, e.target)),
      ),
    }))
    .filter((d) => d.amount > 0);

  const allocation = allocate(dues, totals.left);
  const missingByScope: Partial<Record<Scope, number>> = {};
  dues.forEach((due, index) => {
    if (allocation.missing[index] > 0) {
      missingByScope[due.scope] =
        (missingByScope[due.scope] ?? 0) + allocation.missing[index];
    }
  });

  const byScope: XpSummary['consistency']['byScope'] = {};
  const entry = (scope: Scope) =>
    (byScope[scope] ??= { expected: 0, recorded: 0 });
  for (const e of elements) {
    if (!unlocked.includes(e.scope) && e.cost)
      entry(e.scope).expected += e.cost;
  }
  for (const [target, stack] of ledger.stacks) {
    if (target === LEGACY) continue;
    const scope = ledger.scopes.get(target);
    if (!scope || unlocked.includes(scope)) continue;
    entry(scope).recorded += stack.reduce(
      (total, layer) => total + paidOf(layer) + layer.offered,
      0,
    );
  }
  const legacy = sum(investedIn(ledger, LEGACY));
  const expected = Object.values(byScope).reduce((t, s) => t + s.expected, 0);
  const recorded =
    Object.values(byScope).reduce((t, s) => t + s.recorded, 0) + legacy;

  return {
    ...totals,
    unlocked,
    dues,
    allocation,
    afterValidation: sub(totals.left, allocation.total),
    missingByScope,
    consistency: {
      expected,
      recorded,
      legacy,
      diff: expected - recorded,
      byScope,
    },
  };
};

/**
 * Où en est une fiche en création, en trois temps :
 * 1. recevoir l'XP de création du MJ ;
 * 2. répartir les points (tout se modifie librement) ;
 * 3. valider : le coût est payé et la fiche se verrouille.
 * `null` hors création (fiche validée, ou reset d'une partie seulement).
 */
export const creationStep = (summary: XpSummary): 1 | 2 | 3 | null => {
  if (summary.unlocked.length !== ALL_SCOPES.length) return null;
  if (summary.allocation.feasible) return 3;
  return sum(summary.gained) === 0 ? 1 : 2;
};

/* -------------------------------------------------------------------------- */
/*                               Changements                                  */
/* -------------------------------------------------------------------------- */

/**
 * Un changement de la fiche qui a un coût : positif pour un achat, négatif
 * pour une baisse ou un retrait.
 */
export interface XpChange {
  /** Inconnue tant qu'un nouvel élément n'est pas créé. */
  target?: string;
  scope: Scope;
  delta: number;
  label: string;
}

export const characteristicChange = (
  key: CharacteristicKey,
  from: number | null | undefined,
  to: number | null | undefined,
): XpChange => {
  const c = CHARACTERISTIC_BY_KEY[key];
  return {
    target: charTarget(key),
    scope: c.group,
    delta: characteristicCost(value(to)) - characteristicCost(value(from)),
    label: `${c.label} ${value(from)} → ${value(to)}`,
  };
};

export const skillChange = (
  skill: {
    name: string;
    category: string;
    type: SkillType;
    degree: SkillDegree;
  },
  removed: boolean,
  id?: string,
): XpChange => {
  const cost = SKILL_COSTS[skill.degree] ?? 0;
  return {
    target: id ? skillTarget(id) : undefined,
    scope: skillScope(skill.type),
    delta: removed ? -cost : cost,
    label: `Compétence : ${skillLabel(skill)}`,
  };
};

/** Ajout (rang count + 1) ou retrait (rang count) d'un aspect du Corpus. */
export const corpusChange = (count: number, removed: boolean): XpChange => ({
  target: CORPUS_TARGET,
  scope: 'corpus',
  delta: removed ? -corpusAspectCost(count) : corpusAspectCost(count + 1),
  label: removed
    ? `Corpus : retrait d'un aspect (${count} → ${count - 1})`
    : `Corpus : ${count + 1}ᵉ aspect`,
});

export const spyreeChange = (
  name: string,
  from: number | null | undefined,
  to: number | null | undefined,
  id?: string,
): XpChange => ({
  target: id ? spyreeTarget(id) : undefined,
  scope: 'spyree',
  delta: spyreeCost(to) - spyreeCost(from),
  label: `Spyrée : ${name} ${value(from) ? toRoman(from) : '∅'} → ${
    value(to) ? toRoman(to) : '∅'
  }`,
});

/** Listes dont les éléments coûtent (ou rendent) de l'XP. */
export type XpCollection = 'skills' | 'corpus' | 'spyree';

/**
 * Ce que coûte un élément d'une liste quand on le retire ou le raye (rend sa
 * valeur : négatif) ou quand le MJ le rétablit (positif). Un élément déjà
 * rayé ne rend plus rien : son XP a été perdue en le rayant. Le Corpus se
 * paie au rang : le dernier aspect actif part, le suivant revient.
 *
 * `null` si l'élément n'est pas sur la fiche ou ne coûte pas d'XP.
 */
export const itemChange = (
  sheet: XpItemsInput,
  collection: string,
  itemId: string,
  action: 'remove' | 'strike' | 'restore',
): XpChange | null => {
  const removing = action !== 'restore';
  const verb =
    action === 'strike' ? 'rayé' : action === 'restore' ? 'rétabli' : null;

  if (collection === 'skills') {
    const owned = sheet.skills?.find((s) => s.id === itemId);
    if (!owned || (removing && isLost(owned))) return null;
    const change = skillChange(owned.skill, removing, itemId);
    return verb ? { ...change, label: `${change.label} (${verb})` } : change;
  }
  if (collection === 'corpus') {
    const aspect = sheet.corpus?.find((c) => c.id === itemId);
    if (!aspect || (removing && isLost(aspect))) return null;
    const count = activeOnly(sheet.corpus).length;
    const change = corpusChange(count, removing);
    if (!verb) return change;
    const name = aspect.name ? ` « ${aspect.name} »` : '';
    return {
      ...change,
      label: `Corpus : aspect${name} ${verb} (${count} → ${
        removing ? count - 1 : count + 1
      })`,
    };
  }
  if (collection === 'spyree') {
    const owned = sheet.spyree?.find((s) => s.id === itemId);
    if (!owned || (removing && isLost(owned))) return null;
    const name = owned.potential?.name ?? '?';
    const change = removing
      ? spyreeChange(name, owned.level, 0, itemId)
      : spyreeChange(name, 0, owned.level, itemId);
    if (!verb) return change;
    return {
      ...change,
      label: `Spyrée : ${name} ${toRoman(owned.level)} (${verb})`,
    };
  }
  return null;
};

/* -------------------------------------------------------------------------- */
/*                         Points ajoutés aux caractères                      */
/* -------------------------------------------------------------------------- */

type CharacteristicValuesInput = Partial<
  Record<CharacteristicKey, number | null>
>;

export interface PointsInput {
  /** Valeurs actuelles des caractères. */
  current: CharacteristicValuesInput;
  /** Valeurs visées (seuls les caractères modifiés comptent). */
  target: CharacteristicValuesInput;
  unlocked?: string[] | null;
  entries?: XpEntryInput[];
}

/** Choix de l'utilisateur·ice au moment de valider des points. */
export interface PointsOptions {
  /** Répartition choisie pour chaque partie ; sinon, celle proposée. */
  splits?: Partial<Record<Scope, Amounts>>;
  /** MJ : les achats sont offerts. */
  gift?: boolean;
  /** MJ : les baisses sont remboursées (par défaut) ou l'XP est perdue. */
  refund?: boolean;
}

export interface PointsLine {
  key: CharacteristicKey;
  target: string;
  scope: Scope;
  from: number;
  to: number;
  /** XP : positive pour une hausse, négative pour une baisse. */
  delta: number;
  label: string;
  /** Partie débloquée : rien n'est payé maintenant. */
  free: boolean;
}

export interface PointsPlan {
  lines: PointsLine[];
  /** Ce qu'il faut payer maintenant, par partie validée. */
  dues: Due[];
  /** Baisses d'une partie validée (MJ) : ce qui serait repris. */
  removals: { line: PointsLine; taken: Layer; missing: number }[];
  /** XP disponible pour les achats : restante, plus ce qui est remboursé. */
  balance: Amounts;
  /** Répartition de chaque partie (choisie ou proposée). */
  splits: Partial<Record<Scope, Amounts>>;
  /** Répartition de chaque hausse, caractère par caractère. */
  purchases: { line: PointsLine; split: Amounts }[];
  /** XP à dépenser maintenant. */
  cost: number;
  /** La même, par catégorie (répartitions additionnées). */
  spending: Amounts;
  /** XP des parties débloquées, payée à la validation de la fiche. */
  freeCost: number;
  /** XP manquante avec la répartition proposée, par partie. */
  missingByScope: Partial<Record<Scope, number>>;
  missing: number;
  /** Ce qui empêche de valider, ou null. */
  error: string | null;
}

/**
 * Ce que coûtent les points ajoutés (ou retirés) aux caractères : chaque
 * hausse d'une partie validée est un achat, chaque baisse une reprise du MJ ;
 * une partie débloquée se modifie sans rien payer. Les reprises passent en
 * premier : l'XP remboursée peut payer les achats.
 *
 * Ne vérifie pas les droits (seul le MJ baisse ou offre) : c'est à l'appelant.
 */
export const planPoints = (
  { current, target, unlocked, entries = [] }: PointsInput,
  { splits: chosen, gift = false, refund = true }: PointsOptions = {},
): PointsPlan => {
  const lines: PointsLine[] = CHARACTERISTICS.filter(
    (c) => c.key in target && value(target[c.key]) !== value(current[c.key]),
  ).map((c) => {
    const change = characteristicChange(c.key, current[c.key], target[c.key]);
    return {
      key: c.key,
      target: charTarget(c.key),
      scope: change.scope,
      from: value(current[c.key]),
      to: value(target[c.key]),
      delta: change.delta,
      label: change.label,
      free: (unlocked ?? []).includes(change.scope),
    };
  });

  const ledger = buildLedger(entries);
  const removals = lines
    .filter((l) => !l.free && l.delta < 0)
    .map((line) => {
      const { taken, missing } = peekRemoval(ledger, line.target, -line.delta);
      recordRemoval(ledger, line.target, taken);
      return { line, taken, missing };
    });
  const refunded = refund
    ? removals.reduce((total, r) => add(total, amountsOf(r.taken)), zero())
    : zero();
  const balance = add(xpTotals(entries).left, refunded);

  const bought = lines.filter((l) => !l.free && l.delta > 0);
  const dues: Due[] = SCOPES.filter((s) =>
    bought.some((l) => l.scope === s.key),
  ).map((s) => ({
    target: s.key,
    scope: s.key,
    label: s.label,
    amount: bought
      .filter((l) => l.scope === s.key)
      .reduce((total, l) => total + l.delta, 0),
  }));

  const allocation = allocate(dues, balance);
  const missingByScope: Partial<Record<Scope, number>> = {};
  dues.forEach((due, index) => {
    if (allocation.missing[index] > 0) {
      missingByScope[due.scope] = allocation.missing[index];
    }
  });
  const missing = allocation.missing.reduce((total, m) => total + m, 0);

  const splits: Partial<Record<Scope, Amounts>> = {};
  let error: string | null = null;
  if (!gift) {
    const remaining = { ...balance };
    dues.forEach((due, index) => {
      const split = chosen
        ? (chosen[due.scope] ?? zero())
        : allocation.splits[index];
      splits[due.scope] = split;
      const problem = chosen
        ? checkSplit(split, due.amount, due.scope, remaining)
        : null;
      if (problem && !error) error = `${due.label} : ${problem}`;
      for (const pool of POOLS) remaining[pool.key] -= split[pool.key];
    });
    if (!chosen && missing > 0) {
      error = `XP insuffisante : il manque ${missing} XP (${Object.entries(
        missingByScope,
      )
        .map(([s, m]) => `${SCOPE_BY_KEY[s as Scope].label} ${m}`)
        .join(', ')}).`;
    }
  }

  // Chaque caractère prend sa part de la répartition de sa partie.
  const left = Object.fromEntries(
    Object.entries(splits).map(([s, split]) => [s, { ...split }]),
  ) as Partial<Record<Scope, Amounts>>;
  const purchases = bought.map((line) => {
    if (gift) return { line, split: zero() };
    const pot = left[line.scope] ?? zero();
    const { split } = suggestSplit(line.delta, line.scope, pot);
    for (const pool of POOLS) pot[pool.key] -= split[pool.key];
    return { line, split };
  });

  return {
    lines,
    dues,
    removals,
    balance,
    splits,
    purchases,
    cost: dues.reduce((total, d) => total + d.amount, 0),
    spending: Object.values(splits).reduce(add, zero()),
    freeCost: lines
      .filter((l) => l.free)
      .reduce((total, l) => total + l.delta, 0),
    missingByScope,
    missing,
    error,
  };
};

/** Remboursement proposé quand le MJ baisse ou retire un élément validé. */
export const suggestRefund = (
  entries: XpEntryInput[],
  target: string,
  amount: number,
) => {
  const { taken, missing } = peekRemoval(buildLedger(entries), target, amount);
  return {
    amounts: { feel: taken.feel, learn: taken.learn, live: taken.live },
    offered: taken.offered,
    missing,
  };
};
