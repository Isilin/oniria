import { Prisma } from '@prisma/client';

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
