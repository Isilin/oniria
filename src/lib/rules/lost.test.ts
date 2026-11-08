import { describe, expect, it } from 'vitest';
import {
  activeOnly,
  addLostPoints,
  clearLostPoints,
  isLost,
  lostPointsOf,
} from './lost';

describe('éléments rayés', () => {
  it('reconnaît un élément rayé', () => {
    expect(isLost({ lostAt: new Date() })).toBe(true);
    expect(isLost({ lostAt: '2026-11-08T20:00:00.000Z' })).toBe(true);
    expect(isLost({ lostAt: null })).toBe(false);
    expect(isLost({})).toBe(false);
  });

  it('garde les éléments actifs', () => {
    const items = [{ id: 'a' }, { id: 'b', lostAt: new Date() }, { id: 'c' }];
    expect(activeOnly(items).map((i) => i.id)).toEqual(['a', 'c']);
    expect(activeOnly(undefined)).toEqual([]);
  });
});

describe('points rayés', () => {
  it('lit seulement les entiers positifs des caractéristiques connues', () => {
    expect(
      lostPointsOf({ strength: 5, will: 0, ego: -2, agility: 1.5, magie: 3 }),
    ).toEqual({ strength: 5 });
    expect(lostPointsOf(null)).toEqual({});
    expect(lostPointsOf([5])).toEqual({});
    expect(lostPointsOf('5')).toEqual({});
  });

  it('additionne les points rayés', () => {
    expect(addLostPoints({ strength: 5 }, { strength: 3, will: 2 })).toEqual({
      strength: 8,
      will: 2,
    });
    expect(addLostPoints({}, { strength: 0 })).toEqual({});
  });

  it('efface la rature des points rétablis', () => {
    expect(
      clearLostPoints({ strength: 5, will: 2 }, ['strength', 'agility']),
    ).toEqual({ will: 2 });
  });
});
