/**
 * Les encres et les papiers du carnet, en valeurs brutes. Le thème MUI les
 * expose en variables CSS ; l'export PDF, qui n'a pas de CSS, les lit ici.
 * Voir DESIGN.md (Colors).
 */

/** Jour : la feuille sur une table claire. */
export const DAY = {
  table: '#e4dcc8',
  paper: '#efe6cf',
  raised: '#f6efdc',
  print: '#3b3328',
  print2: '#665c4b',
  pen: '#23336b',
  guide: 'rgba(62, 79, 140, 0.12)',
  margin: 'rgba(178, 70, 52, 0.32)',
};

/** Nuit : la même feuille à la bougie, papier sourd, table dans l'ombre. */
export const CANDLE = {
  table: '#0d0906',
  paper: '#cfbc96',
  raised: '#d9c8a3',
  print: '#3a2a1a',
  print2: '#4a3824',
  pen: '#22305a',
  guide: 'rgba(90, 52, 20, 0.13)',
  margin: 'rgba(150, 60, 30, 0.34)',
};

/** Encres d'état et sanguine : 4,5:1 au moins sur leur papier. */
export const DAY_INKS = {
  secondary: '#9a4a2a',
  error: '#a63a2a',
  warning: '#924716',
  info: '#355d8a',
  success: '#2f6640',
};

export const CANDLE_INKS = {
  secondary: '#77321a',
  error: '#842a1c',
  warning: '#78380e',
  info: '#254a73',
  success: '#22542f',
};

/** Les aquarelles des Existences, dans les planètes seulement. */
export const DAY_EXISTENCES = {
  health: '#a8432f',
  stability: '#3d6a99',
  radiance: '#9a7414',
  mai: '#6a55a0',
};

export const CANDLE_EXISTENCES = {
  health: '#9a3a28',
  stability: '#2f5a85',
  radiance: '#86640c',
  mai: '#5a4690',
};

export type Existence = keyof typeof DAY_EXISTENCES;
