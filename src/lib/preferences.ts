/**
 * Réglages de l'interface propres à chaque compte : ils suivent le joueur
 * d'un appareil à l'autre. Partagé entre l'API (validation) et l'interface.
 */
export const THEME_MODES = ['system', 'light', 'dark'] as const;
export const DENSITIES = ['comfortable', 'compact'] as const;

/** Sections de la fiche qu'on peut replier. */
export const SECTION_KEYS = [
  'characters',
  'faculties',
  'combat',
  'experience',
] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type Density = (typeof DENSITIES)[number];
export type SectionKey = (typeof SECTION_KEYS)[number];

export interface Preferences {
  theme?: ThemeMode;
  density?: Density;
  collapsed?: SectionKey[];
}

const isOneOf = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => values.includes(value as T);

/** Ne garde que les réglages connus et valides ; ignore le reste. */
export const parsePreferences = (input: unknown): Preferences => {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<
    string,
    unknown
  >;
  const prefs: Preferences = {};
  if (isOneOf(THEME_MODES, raw.theme)) prefs.theme = raw.theme;
  if (isOneOf(DENSITIES, raw.density)) prefs.density = raw.density;
  if (Array.isArray(raw.collapsed)) {
    prefs.collapsed = [
      ...new Set(raw.collapsed.filter((k) => isOneOf(SECTION_KEYS, k))),
    ] as SectionKey[];
  }
  return prefs;
};
