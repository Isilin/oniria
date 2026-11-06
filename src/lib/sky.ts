/**
 * Géométrie du ciel du carnet : phases de lune et planètes des Existences.
 * Fonctions pures, partagées par l'écran (SVG) et l'export PDF, pour que
 * la feuille imprimée dessine exactement les mêmes astres.
 */

/** Partie éclairée d'une lune de rayon r centrée en (cx, cy). */
export const litPath = (
  fraction: number,
  cx: number,
  cy: number,
  r: number,
) => {
  if (fraction <= 0) return null;
  if (fraction >= 1)
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  const rx = r * Math.abs(1 - 2 * fraction);
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx.toFixed(2)} ${r} 0 0 ${fraction > 0.5 ? 1 : 0} ${cx} ${cy - r} Z`;
};

/** Les phases de la frise du bandeau-titre, de la nouvelle lune à la pleine. */
export const MOON_PHASES = [0, 0.2, 0.4, 0.6, 1, 0.6, 0.4, 0.2, 0];

/**
 * Une planète d'Existence, dans une boîte de 64 × 64 : le disque au centre,
 * les points posés sur un arc de trois quarts de tour, ouvert en bas.
 */
export const PLANET = {
  /** Centre de la boîte. */
  C: 32,
  /** Rayon du disque. */
  DISC: 15,
  /** Rayon de l'arc des points. */
  DOTS: 26,
  ARC_START: 135,
  ARC_SPAN: 270,
  /** Au-delà, les points se toucheraient : l'arc devient un trait continu. */
  MAX_DOTS: 24,
} as const;

/** Point de l'arc à l'angle donné (degrés), à la distance donnée du centre. */
export const planetPoint = (angle: number, radius: number = PLANET.DOTS) => {
  const rad = (angle * Math.PI) / 180;
  return [
    PLANET.C + radius * Math.cos(rad),
    PLANET.C + radius * Math.sin(rad),
  ] as const;
};

/** Arc de l'orbite des points, d'un angle à l'autre (degrés). */
export const planetArc = (from: number, to: number) => {
  const [x1, y1] = planetPoint(from);
  const [x2, y2] = planetPoint(to);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${PLANET.DOTS} ${PLANET.DOTS} 0 ${to - from > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

/** Part éclairée de la planète : la valeur courante sur le maximum. */
export const planetFraction = (current: number, max: number) =>
  max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;

/**
 * Les points d'une planète : un par point d'Existence, cochés jusqu'à la
 * valeur courante. Au-delà de `MAX_DOTS`, aucun point : l'arc devient un
 * trait continu (`dotted` faux).
 */
export const planetDots = (max: number, current: number) => {
  const count = Math.max(0, Math.round(max));
  const dotted = count > 0 && count <= PLANET.MAX_DOTS;
  if (!dotted) return { dotted, dots: [] };
  const span = PLANET.ARC_SPAN / count;
  return {
    dotted,
    dots: Array.from({ length: count }, (_, i) => {
      const [x, y] = planetPoint(PLANET.ARC_START + (i + 0.5) * span);
      return { x, y, filled: i < current };
    }),
  };
};
