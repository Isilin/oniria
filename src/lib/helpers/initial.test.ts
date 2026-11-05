import { describe, expect, it } from 'vitest';
import { initialOf } from './initial';

describe('initialOf', () => {
  it('prend la première lettre, en capitale', () => {
    expect(initialOf('lyse')).toBe('L');
    expect(initialOf('  éole')).toBe('É');
  });

  it('ne coupe pas un emoji ni une lettre composée', () => {
    expect(initialOf('🌙 Lune')).toBe('🌙');
    expect(initialOf('👩‍🚀 Astra')).toBe('👩‍🚀');
    expect(initialOf('e\u0301mile')).toBe('E\u0301');
  });

  it('garde une seule lettre et remplace un nom vide', () => {
    expect(initialOf('ßeta')).toBe('ß');
    expect(initialOf('   ')).toBe('?');
    expect(initialOf(null)).toBe('?');
  });
});
