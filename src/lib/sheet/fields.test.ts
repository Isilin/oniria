import { describe, expect, it } from 'vitest';
import {
  COLLECTIONS,
  INT_LIMIT,
  readName,
  SHEET_FIELDS,
  sanitizeFields,
  STRING_MAX,
  TEXT_MAX,
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

describe('bornes des champs', () => {
  it('retire les espaces autour des champs courts, pas des textes', () => {
    expect(
      sanitizeFields(SHEET_FIELDS, { name: '  Lyse  ', notes: '  # Carnet\n' }),
    ).toEqual({ name: 'Lyse', notes: '  # Carnet\n' });
    expect(sanitizeFields(SHEET_FIELDS, { aspect: '   ' })).toEqual({
      aspect: null,
    });
  });

  it('refuse les textes trop longs', () => {
    expect(() =>
      sanitizeFields(SHEET_FIELDS, { name: 'a'.repeat(STRING_MAX + 1) }),
    ).toThrow(ValidationError);
    expect(
      sanitizeFields(SHEET_FIELDS, { name: 'a'.repeat(STRING_MAX) }),
    ).toEqual({ name: 'a'.repeat(STRING_MAX) });
    expect(() =>
      sanitizeFields(SHEET_FIELDS, { notes: 'a'.repeat(TEXT_MAX + 1) }),
    ).toThrow(ValidationError);
    // Une adresse d'image peut dépasser un champ court.
    expect(
      sanitizeFields(SHEET_FIELDS, { avatar: `https://x/${'a'.repeat(400)}` }),
    ).toHaveProperty('avatar');
  });

  it('refuse les nombres que la base ne peut pas garder', () => {
    expect(() => sanitizeFields(SHEET_FIELDS, { age: 99999999999 })).toThrow(
      ValidationError,
    );
    expect(sanitizeFields(SHEET_FIELDS, { age: INT_LIMIT })).toEqual({
      age: INT_LIMIT,
    });
  });
});

describe('readName', () => {
  it('nettoie un nom et dit quand il est vide', () => {
    expect(readName('  Table du jeudi ')).toBe('Table du jeudi');
    expect(readName('   ')).toBeNull();
    expect(readName(undefined)).toBeNull();
    expect(() => readName('a'.repeat(STRING_MAX + 1))).toThrow(ValidationError);
  });
});
