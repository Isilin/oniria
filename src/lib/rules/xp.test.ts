import { describe, expect, it } from 'vitest';
import {
  allocate,
  buildLedger,
  characteristicChange,
  checkSplit,
  corpusChange,
  creationStep,
  corpusCost,
  investedIn,
  itemChange,
  offeredTo,
  planPoints,
  SKILL_COSTS,
  skillChange,
  spyreeChange,
  spyreeCost,
  suggestRefund,
  suggestSplit,
  XpEntryInput,
  xpSummary,
  xpTotals,
} from './xp';

const entry = (
  kind: XpEntryInput['kind'],
  amounts: Partial<Record<'feel' | 'learn' | 'live' | 'offered', number>>,
  target: string | null = null,
): XpEntryInput => ({
  kind,
  feel: 0,
  learn: 0,
  live: 0,
  offered: 0,
  ...amounts,
  target,
});

/** Numérote les entrées dans l'ordre d'écriture. */
const journal = (...entries: XpEntryInput[]) =>
  entries.map((e, seq) => ({ ...e, seq }));

const ALL = [
  'body',
  'spirit',
  'soul',
  'general',
  'spyral',
  'martial',
  'corpus',
  'spyree',
];

const stats = (v: number) => ({
  strength: v,
  agility: v,
  vivacity: v,
  vigour: v,
  thinking: v,
  perception: v,
  concentration: v,
  understanding: v,
  charisma: v,
  empathy: v,
  ego: v,
  will: v,
});

describe('coûts', () => {
  it('compétences selon leur degré', () => {
    expect(SKILL_COSTS).toEqual({
      BASE: 10,
      PRINCIPLE: 10,
      MASTERY: 30,
      TECHNIQUE: 10,
      SEQUENCE: 20,
    });
  });

  it('Corpus : 5 le premier aspect, 10 le second, puis 15…', () => {
    expect([0, 1, 2, 3, 4].map(corpusCost)).toEqual([0, 5, 15, 30, 50]);
    expect(corpusChange(2, false).delta).toBe(15);
    expect(corpusChange(3, true).delta).toBe(-15);
  });

  it('Spyrée : prix de chaque passage de rang', () => {
    expect([0, 1, 2, 3, 4, 5].map(spyreeCost)).toEqual([
      0, 10, 40, 110, 260, 570,
    ]);
    expect(spyreeChange('Flamme', 1, 3).delta).toBe(100);
    expect(spyreeChange('Flamme', 0, 1).delta).toBe(10);
    expect(spyreeChange('Flamme', 2, 1).delta).toBe(-30);
  });

  it('caractéristiques : différence de coût entre deux valeurs', () => {
    expect(characteristicChange('strength', 40, 45)).toMatchObject({
      scope: 'body',
      delta: 10,
      target: 'char:strength',
    });
    expect(characteristicChange('will', 70, 80).delta).toBe(4 * 5 + 8 * 5);
    expect(characteristicChange('thinking', 30, 20).delta).toBe(-15);
  });

  it('compétences : périmètre selon leur type', () => {
    expect(
      skillChange(
        { name: '-', category: 'Lutte', type: 'MARTIAL', degree: 'BASE' },
        false,
      ),
    ).toMatchObject({
      scope: 'martial',
      delta: 10,
      label: 'Compétence : Lutte',
    });
  });
});

describe('répartition', () => {
  it("paie avec la catégorie propre d'abord, Vivre en dernier", () => {
    expect(suggestSplit(30, 'body', { feel: 20, learn: 50, live: 50 })).toEqual(
      { split: { feel: 20, learn: 0, live: 10 }, missing: 0 },
    );
    expect(
      suggestSplit(30, 'spirit', { feel: 50, learn: 20, live: 50 }),
    ).toEqual({ split: { feel: 0, learn: 20, live: 10 }, missing: 0 });
    expect(suggestSplit(20, 'soul', { feel: 5, learn: 10, live: 100 })).toEqual(
      {
        split: { feel: 5, learn: 10, live: 5 },
        missing: 0,
      },
    );
    expect(suggestSplit(30, 'corpus', { feel: 5, learn: 50, live: 5 })).toEqual(
      {
        split: { feel: 5, learn: 0, live: 5 },
        missing: 20,
      },
    );
  });

  it('vérifie une répartition choisie', () => {
    const balance = { feel: 10, learn: 10, live: 10 };
    expect(
      checkSplit({ feel: 0, learn: 5, live: 5 }, 10, 'spirit', balance),
    ).toBe(null);
    expect(
      checkSplit({ feel: 5, learn: 5, live: 0 }, 10, 'spirit', balance),
    ).toMatch(/Éprouver ne peut pas payer/);
    expect(
      checkSplit({ feel: 0, learn: 5, live: 0 }, 10, 'spirit', balance),
    ).toMatch(/doit faire 10/);
    expect(
      checkSplit({ feel: 0, learn: 0, live: 15 }, 15, 'spirit', balance),
    ).toMatch(/Pas assez d'XP Vivre/);
    expect(
      checkSplit({ feel: 0, learn: -5, live: 15 }, 10, 'spirit', balance),
    ).toMatch(/invalide/);
  });

  it('trouve une répartition dès qu’il en existe une', () => {
    // L'Âme pourrait prendre l'Éprouver dont le Corps a besoin.
    const dues = [
      { target: 'char:will', scope: 'soul' as const, label: '', amount: 10 },
      { target: 'char:vigour', scope: 'body' as const, label: '', amount: 10 },
    ];
    const allocation = allocate(dues, { feel: 10, learn: 10, live: 0 });
    expect(allocation.feasible).toBe(true);
    expect(allocation.splits).toEqual([
      { feel: 0, learn: 10, live: 0 },
      { feel: 10, learn: 0, live: 0 },
    ]);
    expect(allocate(dues, { feel: 0, learn: 15, live: 0 })).toMatchObject({
      feasible: false,
      missing: [0, 10],
    });
  });
});

describe('journal', () => {
  it('additionne gains, dépenses, remboursements et XP perdue', () => {
    const totals = xpTotals([
      entry('GAIN', { live: 700 }),
      entry('GAIN', { feel: 20, learn: 10 }),
      entry('SPEND', { feel: 15, live: 100 }, 'char:strength'),
      entry('REFUND', { live: 20 }, 'char:strength'),
      entry('LOSS', { feel: 15 }, 'char:strength'),
      entry('GIFT', { offered: 30 }, 'corpus'),
    ]);
    expect(totals).toEqual({
      gained: { feel: 20, learn: 10, live: 700 },
      spent: { feel: 15, learn: 0, live: 80 },
      lost: { feel: 15, learn: 0, live: 0 },
      left: { feel: 5, learn: 10, live: 620 },
    });
  });

  it('rembourse la dernière couche en premier, Vivre avant le reste', () => {
    const entries = journal(
      entry('SPEND', { feel: 10 }, 'char:strength'),
      entry('SPEND', { feel: 6, live: 4 }, 'char:strength'),
    );
    expect(suggestRefund(entries, 'char:strength', 12)).toEqual({
      amounts: { feel: 8, learn: 0, live: 4 },
      offered: 0,
      missing: 0,
    });
  });

  it("ne rembourse pas ce qui avait été offert, et l'offert survit au remboursement de ce qui a été payé", () => {
    const entries = journal(
      entry('SPEND', { live: 10 }, 'spyree:a'),
      entry('GIFT', { offered: 30 }, 'spyree:a'),
    );
    // Retirer le rang II offert ne rend rien.
    expect(suggestRefund(entries, 'spyree:a', 30)).toEqual({
      amounts: { feel: 0, learn: 0, live: 0 },
      offered: 30,
      missing: 0,
    });
    // Le reset rend seulement ce qui a été payé : le cadeau reste.
    const afterReset = buildLedger([
      ...entries,
      { ...entry('REFUND', { live: 10 }, 'spyree:a'), seq: 10 },
    ]);
    expect(investedIn(afterReset, 'spyree:a')).toEqual({
      feel: 0,
      learn: 0,
      live: 0,
    });
    expect(offeredTo(afterReset, 'spyree:a')).toBe(30);
  });

  it("puise dans les dépenses de l'ancienne fiche quand l'élément n'a rien", () => {
    const entries = journal(
      entry('GAIN', { feel: 100, live: 500 }),
      entry('SPEND', { feel: 80, live: 400 }, 'legacy'),
    );
    expect(suggestRefund(entries, 'char:agility', 30)).toEqual({
      amounts: { feel: 0, learn: 0, live: 30 },
      offered: 0,
      missing: 0,
    });
    expect(suggestRefund(entries, 'char:agility', 500).missing).toBe(20);
  });
});

describe('fiche', () => {
  it('en création, le coût est calculé et payé à la validation', () => {
    const summary = xpSummary({
      ...stats(25),
      unlocked: ALL,
      xpEntries: journal(entry('GAIN', { live: 700 })),
    });
    expect(summary.dues.reduce((t, d) => t + d.amount, 0)).toBe(300);
    expect(summary.allocation.feasible).toBe(true);
    expect(summary.afterValidation).toEqual({ feel: 0, learn: 0, live: 400 });
  });

  it('peut dépasser en création : il manque de l’XP par périmètre', () => {
    const summary = xpSummary({
      ...stats(25),
      strength: 50,
      unlocked: ALL,
      corpus: [{}, {}],
      spyree: [{ id: 'a', level: 2, potential: { name: 'Flamme' } }],
    });
    expect(summary.allocation.feasible).toBe(false);
    expect(summary.missingByScope).toEqual({
      body: 75 + 75,
      spirit: 100,
      soul: 100,
      corpus: 15,
      spyree: 40,
    });
  });

  it('une fiche validée et bien tenue est cohérente', () => {
    const summary = xpSummary({
      ...stats(25),
      unlocked: [],
      corpus: [{}],
      xpEntries: journal(
        entry('GAIN', { live: 400 }),
        ...[
          'strength',
          'agility',
          'vivacity',
          'vigour',
          'thinking',
          'perception',
          'concentration',
          'understanding',
          'charisma',
          'empathy',
          'ego',
          'will',
        ].map((key) => entry('SPEND', { live: 25 }, `char:${key}`)),
        entry('GIFT', { offered: 5 }, 'corpus'),
      ),
    });
    expect(summary.consistency).toMatchObject({
      expected: 305,
      recorded: 305,
      diff: 0,
    });
    expect(summary.left).toEqual({ feel: 0, learn: 0, live: 100 });
  });

  it("signale l'écart d'une fiche reprise de l'ancienne version", () => {
    const summary = xpSummary({
      ...stats(25),
      unlocked: [],
      xpEntries: journal(
        entry('GAIN', { feel: 50, live: 300 }),
        entry('SPEND', { feel: 40, live: 220 }, 'legacy'),
      ),
    });
    expect(summary.consistency).toMatchObject({
      expected: 300,
      recorded: 260,
      legacy: 260,
      diff: 40,
    });
  });

  it('les éléments offerts réduisent ce qui reste à payer après un reset', () => {
    const summary = xpSummary({
      ...stats(0),
      unlocked: ['spyree'],
      spyree: [{ id: 'a', level: 2, potential: { name: 'Flamme' } }],
      xpEntries: journal(
        entry('GAIN', { learn: 100 }),
        entry('GIFT', { offered: 10 }, 'spyree:a'),
      ),
    });
    expect(summary.dues).toEqual([
      expect.objectContaining({ target: 'spyree:a', amount: 30 }),
    ]);
  });
});

describe('éléments rayés', () => {
  const athletics = {
    name: '-',
    category: 'Athlétisme',
    type: 'GENERAL' as const,
    degree: 'BASE' as const,
  };
  const sheet = {
    corpus: [
      { id: 'c1', name: 'Origine' },
      { id: 'c2', name: 'Cicatrice', lostAt: '2026-11-08' },
      { id: 'c3', name: 'Haute', type: { name: 'Stature' } },
    ],
    skills: [
      { id: 's1', skill: athletics },
      { id: 's2', skill: athletics, lostAt: '2026-11-08' },
    ],
    spyree: [
      { id: 'p1', level: 2, potential: { name: 'Flamme' } },
      { id: 'p2', level: 1, potential: { name: 'Onde' }, lostAt: new Date() },
    ],
  };

  it('ne comptent plus dans la valeur de la fiche', () => {
    const elements = xpSummary({ ...stats(0), unlocked: ALL, ...sheet }).dues;
    expect(elements.map((e) => [e.target, e.amount])).toEqual([
      ['skill:s1', 10],
      ['corpus', corpusCost(2)],
      ['spyree:p1', 40],
    ]);
  });

  it('rayer rend la valeur de l’élément, rétablir la redemande', () => {
    expect(itemChange(sheet, 'skills', 's1', 'strike')).toMatchObject({
      target: 'skill:s1',
      scope: 'general',
      delta: -10,
      label: 'Compétence : Athlétisme (rayée)',
    });
    expect(itemChange(sheet, 'skills', 's2', 'restore')).toMatchObject({
      delta: 10,
      label: 'Compétence : Athlétisme (rétablie)',
    });
    expect(itemChange(sheet, 'spyree', 'p1', 'strike')).toMatchObject({
      target: 'spyree:p1',
      delta: -40,
      label: 'Spyrée : Flamme II (rayé)',
    });
    expect(itemChange(sheet, 'spyree', 'p2', 'restore')).toMatchObject({
      delta: 10,
      label: 'Spyrée : Onde I (rétabli)',
    });
  });

  it('le rang du Corpus ne compte que les aspects actifs', () => {
    // Deux aspects actifs : rayer rend le 2ᵉ rang, rétablir paie le 3ᵉ.
    expect(itemChange(sheet, 'corpus', 'c3', 'strike')).toMatchObject({
      target: 'corpus',
      delta: -10,
      label: 'Corpus : aspect « Stature : Haute » rayé (2 → 1)',
    });
    expect(itemChange(sheet, 'corpus', 'c2', 'restore')).toMatchObject({
      delta: 15,
      label: 'Corpus : aspect « Cicatrice » rétabli (2 → 3)',
    });
    // Supprimer un aspect actif : même prix, libellé habituel.
    expect(itemChange(sheet, 'corpus', 'c1', 'remove')).toEqual(
      corpusChange(2, true),
    );
  });

  it('un élément déjà rayé ne rend plus rien', () => {
    expect(itemChange(sheet, 'skills', 's2', 'remove')).toBeNull();
    expect(itemChange(sheet, 'corpus', 'c2', 'strike')).toBeNull();
    expect(itemChange(sheet, 'spyree', 'p2', 'remove')).toBeNull();
    expect(itemChange(sheet, 'skills', 'inconnu', 'strike')).toBeNull();
    expect(itemChange(sheet, 'traits', 't1', 'strike')).toBeNull();
  });
});

describe('étapes de la création', () => {
  it("1 : la fiche neuve attend l'XP de création du MJ", () => {
    const summary = xpSummary({ ...stats(25), unlocked: ALL });
    expect(creationStep(summary)).toBe(1);
  });

  it("2 : l'XP est reçue, mais ne couvre pas encore la fiche", () => {
    const summary = xpSummary({
      ...stats(25),
      unlocked: ALL,
      xpEntries: journal(entry('GAIN', { live: 100 })),
    });
    expect(creationStep(summary)).toBe(2);
  });

  it("3 : l'XP couvre la fiche, il reste à valider", () => {
    const summary = xpSummary({
      ...stats(25),
      unlocked: ALL,
      xpEntries: journal(entry('GAIN', { live: 700 })),
    });
    expect(creationStep(summary)).toBe(3);
  });

  it('aucune étape pour une fiche validée ou un reset partiel', () => {
    expect(creationStep(xpSummary({ ...stats(25), unlocked: [] }))).toBe(null);
    expect(
      creationStep(xpSummary({ ...stats(25), unlocked: ['spyree'] })),
    ).toBe(null);
  });
});

describe('points des caractères', () => {
  it('une partie débloquée se modifie sans rien payer', () => {
    const plan = planPoints({
      current: { strength: 20 },
      target: { strength: 30 },
      unlocked: ['body'],
    });
    expect(plan.lines).toEqual([
      expect.objectContaining({
        key: 'strength',
        from: 20,
        to: 30,
        free: true,
      }),
    ]);
    expect(plan).toMatchObject({ cost: 0, freeCost: 15, error: null });
    expect(plan.dues).toEqual([]);
  });

  it('ignore les caractères qui ne changent pas', () => {
    const plan = planPoints({
      current: { strength: 20, agility: 10 },
      target: { strength: 20 },
    });
    expect(plan.lines).toEqual([]);
  });

  it('achats sur plusieurs parties : Vivre gardé pour la fin', () => {
    const plan = planPoints({
      current: { strength: 25, will: 25 },
      target: { strength: 27, will: 26 },
      unlocked: [],
      entries: journal(entry('GAIN', { feel: 3, learn: 1, live: 2 })),
    });
    expect(plan.dues).toEqual([
      expect.objectContaining({ scope: 'body', amount: 4 }),
      expect.objectContaining({ scope: 'soul', amount: 2 }),
    ]);
    expect(plan.splits).toEqual({
      body: { feel: 3, learn: 0, live: 1 },
      soul: { feel: 0, learn: 1, live: 1 },
    });
    expect(plan).toMatchObject({ cost: 6, missing: 0, error: null });
  });

  it("refuse quand il manque de l'XP", () => {
    const plan = planPoints({
      current: { strength: 25 },
      target: { strength: 27 },
      entries: journal(entry('GAIN', { feel: 1, learn: 10 })),
    });
    expect(plan.missing).toBe(3);
    expect(plan.missingByScope).toEqual({ body: 3 });
    expect(plan.error).toBe('XP insuffisante : il manque 3 XP (Le Corps 3).');
  });

  it("vérifie les répartitions choisies ensemble, sur l'XP restante", () => {
    const input = {
      current: { strength: 25, will: 25 },
      target: { strength: 27, will: 26 },
      entries: journal(entry('GAIN', { live: 4 })),
    };
    expect(
      planPoints(input, {
        splits: {
          body: { feel: 0, learn: 0, live: 4 },
          soul: { feel: 0, learn: 0, live: 2 },
        },
      }).error,
    ).toBe("L'Âme : Pas assez d'XP Vivre (reste 0).");
    expect(
      planPoints(input, {
        splits: { body: { feel: 0, learn: 0, live: 4 } },
      }).error,
    ).toBe("L'Âme : La répartition (0) doit faire 2 XP.");
  });

  it('répartit la dépense d’une partie entre ses caractères', () => {
    const plan = planPoints(
      {
        current: { strength: 25, agility: 25 },
        target: { strength: 27, agility: 26 },
        entries: journal(entry('GAIN', { feel: 10, live: 10 })),
      },
      { splits: { body: { feel: 4, learn: 0, live: 2 } } },
    );
    expect(plan.error).toBeNull();
    expect(plan.purchases).toEqual([
      expect.objectContaining({
        line: expect.objectContaining({ key: 'strength' }),
        split: { feel: 4, learn: 0, live: 0 },
      }),
      expect.objectContaining({
        line: expect.objectContaining({ key: 'agility' }),
        split: { feel: 0, learn: 0, live: 2 },
      }),
    ]);
  });

  it("un achat offert ne demande pas d'XP", () => {
    const plan = planPoints(
      { current: { strength: 25 }, target: { strength: 27 } },
      { gift: true },
    );
    expect(plan.error).toBeNull();
    expect(plan.purchases[0].split).toEqual({ feel: 0, learn: 0, live: 0 });
  });

  it("l'XP remboursée par une baisse paie les achats du même lot", () => {
    const input = {
      current: { strength: 27, agility: 25 },
      target: { strength: 25, agility: 27 },
      entries: journal(
        entry('GAIN', { live: 4 }),
        entry('SPEND', { live: 4 }, 'char:strength'),
      ),
    };
    const refunded = planPoints(input);
    expect(refunded.removals).toEqual([
      expect.objectContaining({
        taken: { feel: 0, learn: 0, live: 4, offered: 0 },
        missing: 0,
      }),
    ]);
    expect(refunded.balance).toEqual({ feel: 0, learn: 0, live: 4 });
    expect(refunded.error).toBeNull();
    expect(planPoints(input, { refund: false }).error).toBe(
      'XP insuffisante : il manque 4 XP (Le Corps 4).',
    );
  });

  it("deux baisses ne reprennent pas deux fois les mêmes dépenses de l'ancienne fiche", () => {
    const plan = planPoints({
      current: { strength: 26, agility: 26 },
      target: { strength: 25, agility: 25 },
      entries: journal(
        entry('GAIN', { live: 3 }),
        entry('SPEND', { live: 3 }, 'legacy'),
      ),
    });
    expect(plan.removals.map((r) => [r.taken.live, r.missing])).toEqual([
      [2, 0],
      [1, 1],
    ]);
  });
});
