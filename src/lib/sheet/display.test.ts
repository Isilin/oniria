import { characteristicValues } from '@/lib/rules';
import { ALL_SCOPES } from '@/lib/rules/xp';
import { describe, expect, it } from 'vitest';
import {
  armorTypeLabel,
  corpusStatLabel,
  formatAmounts,
  potentialLabel,
  prerequisiteOf,
  xpListChip,
  xpStatusLabel,
} from './display';

describe('affichage de la fiche', () => {
  it('écrit un montant par catégorie, collé à son libellé', () => {
    expect(formatAmounts({ feel: 10, learn: 0, live: 5 })).toBe(
      'Éprouver\u00a010\u00a0· Vivre\u00a05',
    );
    expect(formatAmounts({ feel: 0, learn: 0, live: 0 })).toBe('0');
    expect(formatAmounts({ feel: 0, learn: 0, live: 0 }, '-')).toBe('-');
  });

  it('nomme le caractère renforcé par un aspect du Corpus', () => {
    expect(corpusStatLabel('strength')).toBe('Force');
    expect(corpusStatLabel('health')).toBe('Santé');
    expect(corpusStatLabel(null)).toBe('-');
  });

  it('nomme un potentiel par son type', () => {
    expect(potentialLabel({ name: 'Éveil', type: { name: 'Lumière' } })).toBe(
      'Lumière - Éveil',
    );
  });

  it('nomme le type d’une armure', () => {
    expect(armorTypeLabel('PARTIAL')).toBe('Partielle');
    expect(armorTypeLabel(null)).toBe('-');
  });

  it('dit si un prérequis d’équipement est rempli', () => {
    const values = characteristicValues({ strength: 35 });
    const unmet = prerequisiteOf(
      { prerequisite_stat: 'strength', prerequisite_value: 40 },
      values,
    );
    expect(unmet.text).toBe('For 40');
    expect(unmet.met).toBe(false);
    expect(unmet.current).toBe(35);
    expect(unmet.stat?.label).toBe('Force');

    const none = prerequisiteOf({}, values);
    expect(none).toMatchObject({ stat: null, text: '-', met: true });
  });

  it('donne l’état de la fiche vis-à-vis de l’XP', () => {
    expect(xpStatusLabel({ unlocked: [] })).toBe('Validée');
    expect(xpStatusLabel({ unlocked: [...ALL_SCOPES] })).toBe('En création');
    expect(xpStatusLabel({ unlocked: [ALL_SCOPES[0]] })).toBe('Reset en cours');
  });

  it('marque dans la vue d’ensemble les fiches pas encore validées', () => {
    const allocation = { feasible: true } as Parameters<
      typeof xpListChip
    >[0]['allocation'];
    expect(xpListChip({ unlocked: [], allocation })).toBeNull();
    expect(xpListChip({ unlocked: [...ALL_SCOPES], allocation })).toBe(
      'à valider',
    );
    expect(
      xpListChip({
        unlocked: [...ALL_SCOPES],
        allocation: { ...allocation, feasible: false },
      }),
    ).toBe('en création');
  });
});
