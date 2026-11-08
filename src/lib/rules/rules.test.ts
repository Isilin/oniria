import { describe, expect, it } from 'vitest';
import {
  characteristicCost,
  normalizeStat,
  parseCorpusEffect,
  computeSheet,
  FacultyKey,
  formatFaculty,
  meetsPrerequisite,
  SheetInput,
  toRoman,
} from '.';

/**
 * Les valeurs attendues proviennent des fiches réelles du tableur
 * « Lunes d'Oniria - Fiches de personnages ».
 */

const facultiesOf = (sheet: SheetInput) => {
  const computed = computeSheet(sheet);
  return Object.fromEntries(
    Object.entries(computed.faculties).map(([k, v]) => [k, formatFaculty(v)]),
  ) as Record<FacultyKey, string>;
};

describe('Érèbe', () => {
  const erebe: SheetInput = {
    strength: 20,
    agility: 25,
    vivacity: 15,
    vigour: 30,
    thinking: 50,
    perception: 45,
    concentration: 50,
    understanding: 40,
    charisma: 75,
    empathy: 50,
    ego: 50,
    will: 50,
    corpus: [
      { stat: null, bonus: null },
      { stat: 'charisma', bonus: 1 },
      { stat: 'empathy', bonus: 1 },
      { stat: null, bonus: null },
      { stat: null, bonus: null },
    ],
    traits: [
      { inborn: true, balance: -1 },
      { inborn: true, balance: -2 },
      { inborn: true, balance: 1 },
      { inborn: true, balance: 1 },
      { inborn: true, balance: 2 },
      { inborn: true, balance: -1 },
      { inborn: true, balance: -1 },
      { inborn: true, balance: -1 },
      { inborn: true, balance: 2 },
      { inborn: false, balance: null },
    ],
    armors: [
      { equipped: true, protection: 9, current_protection: 0, bulk: 10 },
    ],
  };
  const computed = computeSheet(erebe);

  it('calcule les caractères et leur coût', () => {
    expect(computed.groups).toEqual({ body: 18, spirit: 37, soul: 45 });
    expect(computed.groupCosts).toEqual({ body: 95, spirit: 270, soul: 400 });
  });

  it('calcule les facultés avec les bonus du Corpus', () => {
    expect(facultiesOf(erebe)).toEqual({
      directBlow: '40',
      subtleBlow: '30',
      deadlyBlow: '30',
      parade: '45',
      dodge: '40',
      discretion: '50',
      care: '90',
      reflexion: '80',
      improvisation: '100',
      shooting: '90',
      integrity: '100',
      focus: '100',
      spell: '80',
      ritual: '100',
      feeling: '95 / +1',
      persuasion: '125 / +6',
      charm: '125 / +6',
      intimidation: '125 / +6',
      fraud: '125 / +6',
      belief: '100',
      resolution: '100',
    });
  });

  it('calcule les valeurs dérivées et les existences', () => {
    expect(computed).toMatchObject({
      mai: 4,
      damage: -3,
      initiative: 1,
      impact: 5,
      impulsion: 4,
      conduction: 5,
      health: 3,
      healthThreshold: 6,
      stability: 4,
      stabilityThreshold: 8,
      radiance: 4,
      radianceThreshold: 9,
    });
  });

  it("calcule protection, encombrement et l'équilibre des traits", () => {
    expect(computed.protection).toEqual({ current: 0, max: 9 });
    expect(computed.bulk).toBe(10);
    expect(computed.inbornTraitsBalance).toBe(0);
  });
});

describe('Aiguille (Mugi)', () => {
  const aiguille: SheetInput = {
    strength: 50,
    agility: 50,
    vivacity: 35,
    vigour: 50,
    thinking: 25,
    perception: 50,
    concentration: 25,
    understanding: 25,
    charisma: 25,
    empathy: 35,
    ego: 50,
    will: 50,
  };
  const computed = computeSheet(aiguille);

  it('calcule les caractères et leur coût', () => {
    expect(computed.groups).toEqual({ body: 37, spirit: 25, soul: 32 });
    expect(computed.groupCosts).toEqual({ body: 270, spirit: 150, soul: 220 });
    expect(computed.characteristicsCost).toBe(640);
  });

  it('calcule les facultés', () => {
    expect(facultiesOf(aiguille)).toMatchObject({
      directBlow: '100',
      subtleBlow: '70',
      deadlyBlow: '60',
      parade: '100',
      dodge: '85',
      discretion: '75',
      care: '85',
      shooting: '75',
      feeling: '70',
      belief: '100',
      resolution: '100',
    });
  });

  it('calcule les valeurs dérivées', () => {
    expect(computed).toMatchObject({
      mai: 3,
      damage: 0,
      initiative: 3,
      impact: 2,
      impulsion: 5,
      conduction: 2,
      health: 5,
      healthThreshold: 10,
      stability: 2,
      stabilityThreshold: 5,
      radiance: 3,
      radianceThreshold: 6,
    });
  });
});

describe('Genlar', () => {
  const genlar: SheetInput = {
    strength: 25,
    agility: 50,
    vivacity: 25,
    vigour: 50,
    thinking: 70,
    perception: 50,
    concentration: 50,
    understanding: 60,
    charisma: 50,
    empathy: 50,
    ego: 50,
    will: 50,
    corpus: [
      { stat: 'understanding', bonus: 1 },
      { stat: 'vigour', bonus: 1 },
      { stat: 'ego', bonus: 1 },
      { stat: null, bonus: null },
      { stat: null, bonus: null },
      { stat: 'vivacity', bonus: 1 },
    ],
  };
  const computed = computeSheet(genlar);

  it('calcule les caractères et leur coût', () => {
    expect(computed.groups).toEqual({ body: 30, spirit: 46, soul: 40 });
    expect(computed.groupCosts).toEqual({ body: 200, spirit: 420, soul: 300 });
  });

  it('applique les bonus du Corpus', () => {
    expect(facultiesOf(genlar)).toEqual({
      directBlow: '50',
      subtleBlow: '50 / +1',
      deadlyBlow: '50 / +1',
      parade: '75',
      dodge: '75',
      discretion: '100',
      care: '100',
      reflexion: '120 / +3',
      improvisation: '120 / +4',
      shooting: '100',
      integrity: '100',
      focus: '120 / +4',
      spell: '110 / +3',
      ritual: '100',
      feeling: '100',
      persuasion: '100',
      charm: '100',
      intimidation: '100',
      fraud: '100',
      belief: '100 / +1',
      resolution: '100',
    });
  });

  it('calcule les existences', () => {
    expect(computed).toMatchObject({
      health: 5,
      healthThreshold: 10,
      stability: 6,
      stabilityThreshold: 12,
      radiance: 4,
      radianceThreshold: 8,
      impact: 7,
    });
  });
});

describe('Yrsa', () => {
  const yrsa: SheetInput = {
    strength: 75,
    agility: 65,
    vivacity: 40,
    vigour: 50,
    thinking: 25,
    perception: 30,
    concentration: 60,
    understanding: 25,
    charisma: 50,
    empathy: 50,
    ego: 50,
    will: 50,
    corpus: [
      { stat: null, bonus: null },
      { stat: 'vigour', bonus: 1 },
      { stat: 'strength', bonus: 1 },
      { stat: 'ego', bonus: 1 },
      { stat: 'Santé', bonus: 1 },
      { stat: 'will', bonus: 1 },
      { stat: 'empathy', bonus: 1 },
    ],
    armors: [{ equipped: true, protection: 18, bulk: 25 }],
    meleeWeapons: [
      { equipped: true, bulk: null },
      { equipped: true, bulk: 5 },
      { equipped: false, bulk: 15 },
    ],
  };
  const computed = computeSheet(yrsa);

  it('calcule les caractères et leur coût', () => {
    expect(computed.groups).toEqual({ body: 46, spirit: 28, soul: 40 });
    expect(computed.groupCosts).toEqual({ body: 440, spirit: 200, soul: 300 });
  });

  it('applique les bonus du Corpus aux facultés', () => {
    expect(facultiesOf(yrsa)).toEqual({
      directBlow: '140 / +6',
      subtleBlow: '80',
      deadlyBlow: '80',
      parade: '130 / +3',
      dodge: '105 / +3',
      discretion: '125 / +3',
      care: '60',
      reflexion: '50',
      improvisation: '50',
      shooting: '60',
      integrity: '110 / +2',
      focus: '50',
      spell: '50',
      ritual: '110 / +2',
      feeling: '80 / +1',
      persuasion: '100',
      charm: '100',
      intimidation: '100',
      fraud: '100',
      belief: '100 / +1',
      resolution: '100 / +1',
    });
  });

  it('ajoute « Santé +N » à la santé maximale', () => {
    expect(computed.health).toBe(6);
    expect(computed.damage).toBe(2);
  });

  it("additionne l'encombrement de l'armure et des armes équipées", () => {
    expect(computed.protection).toEqual({ current: 18, max: 18 });
    expect(computed.bulk).toBe(30);
  });
});

describe('utilitaires', () => {
  it("calcule le coût d'un caractère par paliers", () => {
    expect(characteristicCost(25)).toBe(25);
    expect(characteristicCost(50)).toBe(75);
    expect(characteristicCost(75)).toBe(175);
    expect(characteristicCost(80)).toBe(215);
  });

  it('convertit les niveaux en chiffres romains', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(2)).toBe('II');
    expect(toRoman(3)).toBe('III');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(0)).toBe('-');
  });

  it('lit les effets du Corpus écrits comme dans le tableur', () => {
    expect(parseCorpusEffect('Cha +1')).toEqual({ stat: 'charisma', bonus: 1 });
    expect(parseCorpusEffect('Viv+1')).toEqual({ stat: 'vivacity', bonus: 1 });
    expect(parseCorpusEffect('Santé +1')).toEqual({ stat: 'health', bonus: 1 });
    expect(parseCorpusEffect('Costume')).toBeNull();
    expect(parseCorpusEffect('Protec : Corps/10')).toBeNull();
  });

  it('reconnaît un caractère par sa clé, son abréviation ou son nom', () => {
    expect(normalizeStat('charisma')).toBe('charisma');
    expect(normalizeStat('Cha')).toBe('charisma');
    expect(normalizeStat('Entendement')).toBe('understanding');
    expect(normalizeStat('Santé')).toBe('health');
    expect(normalizeStat('magie')).toBeNull();
  });

  it("un élément rayé n'a plus d'effet", () => {
    const lostAt = new Date();
    const computed = computeSheet({
      vigour: 30,
      corpus: [
        { stat: 'health', bonus: 1 },
        { stat: 'health', bonus: 2, lostAt },
      ],
      traits: [
        { inborn: true, balance: 2 },
        { inborn: true, balance: -1, lostAt },
      ],
      armors: [
        { equipped: true, protection: 3, bulk: 10 },
        { equipped: true, protection: 5, bulk: 20, lostAt },
      ],
      meleeWeapons: [{ equipped: true, bulk: 5, lostAt }],
      rangeWeapons: [{ equipped: true, bulk: 7 }],
    });
    expect(computed.health).toBe(4);
    expect(computed.inbornTraitsBalance).toBe(2);
    expect(computed.protection).toEqual({ current: 3, max: 3 });
    expect(computed.bulk).toBe(17);
  });

  it('vérifie les prérequis', () => {
    const { values } = computeSheet({ strength: 40, vigour: 25 });
    expect(meetsPrerequisite(values, 'strength', 40)).toBe(true);
    expect(meetsPrerequisite(values, 'vigour', 30)).toBe(false);
    expect(meetsPrerequisite(values, null, null)).toBe(true);
    expect(meetsPrerequisite(values, 'Vigueur', 30)).toBe(false);
    expect(meetsPrerequisite(values, 'For', 40)).toBe(true);
  });
});
