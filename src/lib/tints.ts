/**
 * Teintes de lune : chaque personnage choisit la sienne. Elle colore sa
 * plaque et le cercle de son portrait, d'autant plus fort que son Devenir
 * est élevé. Une valeur par thème : la nuit (sombre) et le jour (clair).
 */
export const TINTS = [
  { key: 'argent', label: "Lune d'argent", night: '#b9c3d6', day: '#5d6b85' },
  { key: 'ambre', label: "Lune d'ambre", night: '#e0b25a', day: '#94640f' },
  { key: 'rouille', label: 'Lune rousse', night: '#d9825f', day: '#a24a28' },
  { key: 'jade', label: 'Lune de jade', night: '#78c0a3', day: '#2e7a5c' },
  { key: 'azur', label: "Lune d'azur", night: '#82aee0', day: '#2f6299' },
  {
    key: 'amethyste',
    label: "Lune d'améthyste",
    night: '#ad94e0',
    day: '#6747a6',
  },
  { key: 'corail', label: 'Lune de corail', night: '#e88e92', day: '#ab3f47' },
  { key: 'nacre', label: 'Lune de nacre', night: '#e6dcc8', day: '#7a6a4a' },
] as const;

export type TintKey = (typeof TINTS)[number]['key'];
export type Tint = (typeof TINTS)[number];

export const TINT_KEYS = TINTS.map(
  (t) => t.key,
) as unknown as readonly TintKey[];
export const DEFAULT_TINT: TintKey = 'argent';

export const tintOf = (key: string | null | undefined): Tint =>
  TINTS.find((t) => t.key === key) ?? TINTS[0];

/** Devenir de référence : 100 est la pleine intensité ; au-delà, transcendance. */
export const DEVENIR_FULL = 100;

/**
 * Intensité de la teinte selon le Devenir : de 0 (teinte à peine posée) à 1
 * (pleine). Un Devenir absent ou non numérique garde une intensité moyenne.
 */
export const devenirIntensity = (become: string | null | undefined) => {
  const value = Number.parseInt(String(become ?? '').trim(), 10);
  if (!Number.isFinite(value)) return { level: 0.5, transcendent: false };
  return {
    level: Math.max(0, Math.min(1, value / DEVENIR_FULL)),
    transcendent: value > DEVENIR_FULL,
  };
};
