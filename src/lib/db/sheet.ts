import { Amee, Corpus, Golem, Item, Prisma, Spell } from '@prisma/client';

export type SheetWithUser = Prisma.SheetGetPayload<{
  include: { user: true };
}>;

export type ExtendedSheetWithUser = SheetWithUser & {
  body: number;
  spirit: number;
  soul: number;
  mai: number;
  directBlow: number;
  subtleBlow: number;
  deadlyBlow: number;
  parade: number;
  dodge: number;
  discretion: number;
  care: number;
  reflexion: number;
  improvisation: number;
  shooting: number;
  integrity: number;
  focus: number;
  spell: number;
  ritual: number;
  feeling: number;
  persuasion: number;
  charm: number;
  intimidation: number;
  fraud: number;
  belief: number;
  resolution: number;
  damage: number;
  initiative: number;
  impact: number;
  impulsion: number;
  conduction: number;
  health: number;
  healthThreshold: number;
  stability: number;
  stabilityThreshold: number;
  radiance: number;
  radianceThreshold: number;
  spent_feel_xp: number;
  spent_learn_xp: number;
  spent_live_xp: number;
};

export type SpyreeWithPotential = Prisma.SpyreeGetPayload<{
  include: {
    potential: { include: { type: { include: { category: true } } } };
  };
}>;

export interface Schemas {
  corpus: Corpus[];
  spyree: SpyreeWithPotential[];
  amee: Amee[];
}

export type ArmorWithProperties = Prisma.ArmorGetPayload<{
  include: { properties: true };
}>;

export type MeleeWeaponWithProperties = Prisma.MeleeWeaponGetPayload<{
  include: { properties: true };
}>;

export type RangeWeaponWithProperties = Prisma.RangeWeaponGetPayload<{
  include: { properties: true };
}>;

export interface Inventory {
  armors: ArmorWithProperties[];
  meleeWeapons: MeleeWeaponWithProperties[];
  rangeWeapons: RangeWeaponWithProperties[];
  items: Item[];
  golems: Golem[];
  spells: Spell[];
}
