import { describe, expect, it } from 'vitest';
import {
  batchTitle,
  entryDate,
  entryDetail,
  formatSigned,
  groupEntries,
  type JournalEntry,
  signedAmounts,
  sumAmounts,
} from './journal';

let seq = 0;
const entry = (patch: Partial<JournalEntry>): JournalEntry => ({
  id: `e${++seq}`,
  kind: 'GAIN',
  feel: 0,
  learn: 0,
  live: 0,
  offered: 0,
  label: 'Session',
  batch: null,
  createdAt: '2026-11-06T10:00:00.000Z',
  ...patch,
});

describe('journal de l’expérience', () => {
  it('signe chaque écriture selon son effet sur l’XP restante', () => {
    expect(signedAmounts(entry({ kind: 'GAIN', feel: 10 }))).toEqual({
      feel: 10,
      learn: 0,
      live: 0,
    });
    expect(signedAmounts(entry({ kind: 'SPEND', live: 5 })).live).toBe(-5);
    expect(signedAmounts(entry({ kind: 'REFUND', learn: 3 })).learn).toBe(3);
    expect(signedAmounts(entry({ kind: 'LOSS', live: 7 })).live).toBe(0);
    expect(signedAmounts(entry({ kind: 'GIFT', feel: 4 })).feel).toBe(0);
  });

  it('écrit un vrai signe moins et rien pour zéro', () => {
    expect(formatSigned(10)).toBe('+10');
    expect(formatSigned(-5)).toBe('\u22125');
    expect(formatSigned(0)).toBe('');
  });

  it('additionne les montants d’un lot', () => {
    expect(
      sumAmounts([
        { feel: 1, learn: 2, live: 3 },
        { feel: -1, learn: 0, live: 4 },
      ]),
    ).toEqual({ feel: 0, learn: 2, live: 7 });
    expect(sumAmounts([])).toEqual({ feel: 0, learn: 0, live: 0 });
  });

  it('regroupe les écritures d’un même lot, la plus récente d’abord', () => {
    const a = entry({ label: 'Création' });
    const b = entry({ kind: 'SPEND', batch: 'validation:1' });
    const c = entry({ kind: 'SPEND', batch: 'validation:1' });
    const d = entry({ label: 'Session 7' });
    const groups = groupEntries([a, b, c, d]);
    expect(groups.map((g) => g.map((e) => e.id))).toEqual([
      [d.id],
      [c.id, b.id],
      [a.id],
    ]);
  });

  it('donne un titre aux lots connus', () => {
    expect(batchTitle([entry({ batch: 'validation:x' })])).toBe('Validation');
    expect(batchTitle([entry({ batch: 'reset:x' })])).toBe(
      'Reset accordé par le MJ',
    );
    expect(batchTitle([entry({ batch: 'legacy-x' })])).toBe(
      'Reprise de l’ancienne fiche',
    );
    expect(batchTitle([entry({ batch: 'autre', label: 'Achat' })])).toBe(
      'Achat',
    );
  });

  it('précise la valeur offerte et l’XP perdue', () => {
    expect(entryDetail(entry({ kind: 'GIFT', offered: 30 }))).toBe(
      ' (valeur 30 XP)',
    );
    expect(entryDetail(entry({ kind: 'LOSS', feel: 10, live: 5 }))).toBe(
      ' (15 XP perdus)',
    );
    expect(entryDetail(entry({ kind: 'LOSS' }))).toBe('');
    expect(entryDetail(entry({ kind: 'SPEND', offered: 5 }))).toBe(
      ' (dont 5 offerts)',
    );
  });

  it('date une écriture du soir dans le fuseau de la table', () => {
    const late = entry({ createdAt: '2026-11-06T23:30:00.000Z' });
    expect(entryDate(late, 'Europe/Paris')).toBe('07/11/2026');
    expect(entryDate(late, 'UTC')).toBe('06/11/2026');
  });
});
