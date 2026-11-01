import { describe, expect, it } from 'vitest';
import {
  COLLECTIONS,
  SHEET_FIELDS,
  sanitizeFields,
  ValidationError,
} from './fields';

describe('sanitizeFields', () => {
  it('ignore les champs inconnus ou protégés', () => {
    expect(
      sanitizeFields(SHEET_FIELDS, {
        strength: '40',
        userId: 'pirate',
        id: 'x',
        user: { connect: { id: 'y' } },
      }),
    ).toEqual({ strength: 40 });
  });

  it('convertit les types', () => {
    expect(
      sanitizeFields(COLLECTIONS.armors.fields, {
        name: 'Brigandine',
        protection: '18',
        bulk: '',
        equipped: 'true',
        prerequisite_stat: 'vigour',
        properties: ['p1', 'p2'],
      }),
    ).toEqual({
      name: 'Brigandine',
      protection: 18,
      bulk: null,
      equipped: true,
      prerequisite_stat: 'vigour',
      properties: ['p1', 'p2'],
    });
  });

  it('refuse les valeurs invalides', () => {
    expect(() =>
      sanitizeFields(SHEET_FIELDS, { strength: 'beaucoup' }),
    ).toThrow(ValidationError);
    expect(() =>
      sanitizeFields(COLLECTIONS.corpus.fields, { stat: 'magie' }),
    ).toThrow(ValidationError);
    expect(() =>
      sanitizeFields(COLLECTIONS.armors.fields, { properties: 'p1' }),
    ).toThrow(ValidationError);
    expect(() => sanitizeFields(SHEET_FIELDS, ['strength'])).toThrow(
      ValidationError,
    );
  });
});
