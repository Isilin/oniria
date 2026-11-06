/**
 * Description des champs modifiables d'une fiche et de ses listes.
 * Partagé entre l'API (validation) et l'interface (formulaires).
 */

import { TINT_KEYS } from '../tints';

export type FieldType =
  'string' | 'text' | 'int' | 'boolean' | 'enum' | 'ref' | 'refs';

export interface FieldSpec {
  type: FieldType;
  /** Valeurs autorisées pour un champ `enum`. */
  values?: readonly string[];
  /** Longueur maximale d'un champ `string` ou `text`, si autre que l'usuelle. */
  max?: number;
}

/**
 * Plus grand entier que la base accepte (int4 de PostgreSQL) : au-delà, elle
 * refuse l'écriture. Une borne technique, pas une règle du jeu.
 */
export const INT_LIMIT = 2_147_483_647;
/** Longueur maximale d'un champ court : nom, Aspect, incantation… */
export const STRING_MAX = 200;
/** Longueur maximale d'un texte : notes, descriptions. */
export const TEXT_MAX = 100_000;
/** Longueur maximale d'une adresse (portrait). */
export const URL_MAX = 2048;

export type FieldSpecs = Record<string, FieldSpec>;

const string: FieldSpec = { type: 'string' };
const text: FieldSpec = { type: 'text' };
const int: FieldSpec = { type: 'int' };
const boolean: FieldSpec = { type: 'boolean' };
const ref: FieldSpec = { type: 'ref' };
/** Liste d'identifiants d'un catalogue (ex. propriétés d'une arme). */
const refs: FieldSpec = { type: 'refs' };

export const STAT_KEYS = [
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
] as const;

/** Un bonus de Corpus porte sur un caractère ou sur la santé. */
export const CORPUS_STATS = [...STAT_KEYS, 'health'] as const;

export const SKILL_TYPES = ['GENERAL', 'SPYRAL', 'MARTIAL'] as const;
export const SKILL_DEGREES = [
  'BASE',
  'PRINCIPLE',
  'MASTERY',
  'TECHNIQUE',
  'SEQUENCE',
] as const;
export const ARMOR_TYPES = ['LOW', 'PARTIAL', 'FULL'] as const;

export const SHEET_FIELDS: FieldSpecs = {
  name: string,
  avatar: { type: 'string', max: URL_MAX },
  age: int,
  current_mai: int,
  aspect: string,
  become: string,
  tint: { type: 'enum', values: TINT_KEYS },
  ...Object.fromEntries(STAT_KEYS.map((key) => [key, int])),
  current_health: int,
  current_stability: int,
  current_radiance: int,
  notes: text,
};

const prerequisite: FieldSpecs = {
  prerequisite_stat: { type: 'enum', values: STAT_KEYS },
  prerequisite_value: int,
};

/** Les listes d'une fiche, indexées par le nom de la relation Prisma. */
export const COLLECTIONS = {
  corpus: {
    model: 'corpus',
    fields: {
      typeId: ref,
      name: string,
      description: text,
      stat: { type: 'enum', values: CORPUS_STATS },
      bonus: int,
    },
  },
  spyree: { model: 'spyree', fields: { potentialId: ref, level: int } },
  amee: { model: 'amee', fields: { name: string, description: text } },
  traits: {
    model: 'trait',
    fields: { name: string, description: text, balance: int, inborn: boolean },
  },
  skills: {
    model: 'sheetSkill',
    fields: { skillId: ref, prerequisiteId: ref, suffixe: string },
  },
  spells: {
    model: 'spell',
    fields: {
      name: string,
      incantation: string,
      targeting: string,
      duration: string,
      effect: text,
    },
  },
  golems: {
    model: 'golem',
    fields: { name: string, artefact: text, symbiosis: text, heart: text },
  },
  armors: {
    model: 'armor',
    fields: {
      name: string,
      protection: int,
      current_protection: int,
      index: int,
      type: { type: 'enum', values: ARMOR_TYPES },
      bulk: int,
      solidity: int,
      ...prerequisite,
      properties: refs,
      quality: int,
      equipped: boolean,
    },
  },
  meleeWeapons: {
    model: 'meleeWeapon',
    fields: {
      name: string,
      damage: int,
      extend: int,
      bulk: int,
      solidity: int,
      ...prerequisite,
      properties: refs,
      quality: int,
      equipped: boolean,
    },
  },
  rangeWeapons: {
    model: 'rangeWeapon',
    fields: {
      name: string,
      damage: int,
      penetration_damage: int,
      velocity: int,
      rate: int,
      reload_rate: int,
      low_range: int,
      medium_range: int,
      long_range: int,
      bulk: int,
      solidity: int,
      ...prerequisite,
      properties: refs,
      quality: int,
      equipped: boolean,
    },
  },
  items: {
    model: 'item',
    fields: { name: string, description: text, quantity: int },
  },
} as const satisfies Record<string, { model: string; fields: FieldSpecs }>;

export type CollectionKey = keyof typeof COLLECTIONS;

export const isCollection = (key: string): key is CollectionKey =>
  Object.prototype.hasOwnProperty.call(COLLECTIONS, key);

/** Listes dont les ajouts et retraits coûtent (ou rendent) de l'XP. */
export const XP_COLLECTIONS: readonly CollectionKey[] = [
  'skills',
  'corpus',
  'spyree',
];

export class ValidationError extends Error {}

const coerce = (key: string, spec: FieldSpec, value: unknown) => {
  if (spec.type === 'refs') {
    if (!Array.isArray(value)) {
      throw new ValidationError(`« ${key} » doit être une liste.`);
    }
    return value.map((v) => String(v));
  }
  if (value === null || value === undefined || value === '') {
    return spec.type === 'boolean' ? false : null;
  }
  switch (spec.type) {
    case 'string':
    case 'text': {
      // Un champ court ne garde pas les espaces autour : « Lyse » et non
      // « Lyse  ». Un texte (notes en markdown) reste tel quel.
      const string =
        spec.type === 'string' ? String(value).trim() : String(value);
      const max = spec.max ?? (spec.type === 'string' ? STRING_MAX : TEXT_MAX);
      if (string.length > max) {
        throw new ValidationError(
          `« ${key} »\u00a0: ${max.toLocaleString('fr-FR')} caractères au plus.`,
        );
      }
      return string || null;
    }
    case 'ref':
      return String(value);
    case 'int': {
      const number = Number(value);
      if (!Number.isFinite(number)) {
        throw new ValidationError(`« ${key} » doit être un nombre.`);
      }
      if (Math.abs(number) > INT_LIMIT) {
        throw new ValidationError(`« ${key} »\u00a0: nombre trop grand.`);
      }
      return Math.trunc(number);
    }
    case 'boolean':
      return value === true || value === 'true';
    case 'enum':
      if (!spec.values?.includes(String(value))) {
        throw new ValidationError(`Valeur invalide pour « ${key} ».`);
      }
      return String(value);
  }
};

/** Ne garde que les champs connus et convertit leurs valeurs. */
export const sanitizeFields = (
  specs: FieldSpecs,
  data: unknown,
): Record<string, unknown> => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ValidationError('Données invalides.');
  }
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => Object.prototype.hasOwnProperty.call(specs, key))
      .map(([key, value]) => [key, coerce(key, specs[key], value)]),
  );
};

/**
 * Nom d'une fiche, d'une table ou d'une propriété : sans espaces autour, et
 * jamais plus long qu'un champ court. Vide : `null` (à l'appelant de dire ce
 * qu'il en fait).
 */
export const readName = (value: unknown) => {
  const name = String(value ?? '').trim();
  if (name.length > STRING_MAX) {
    throw new ValidationError(
      `Le nom\u00a0: ${STRING_MAX} caractères au plus.`,
    );
  }
  return name || null;
};
