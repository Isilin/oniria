/**
 * Filtres SVG partagés par toute l'app, définis une seule fois :
 * - `oniria-wash` : lavis d'aquarelle (bords qui bavent) ;
 * - `oniria-ink` : point d'encre légèrement irrégulier ;
 * - `oniria-rough` : trait de plume tremblé, pour les croquis.
 */
const SvgDefs = () => (
  <svg
    width="0"
    height="0"
    aria-hidden
    focusable="false"
    style={{ position: 'absolute' }}
  >
    <filter id="oniria-wash" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.08"
        numOctaves="2"
        seed="5"
      />
      <feDisplacementMap in="SourceGraphic" scale="3.2" />
      <feGaussianBlur stdDeviation="0.6" />
    </filter>
    <filter id="oniria-wash-wide" x="-25%" y="-35%" width="150%" height="170%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.014"
        numOctaves="3"
        seed="3"
      />
      <feDisplacementMap in="SourceGraphic" scale="40" />
      <feGaussianBlur stdDeviation="2.5" />
    </filter>
    <filter id="oniria-ink">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.6"
        numOctaves="2"
        seed="3"
      />
      <feDisplacementMap in="SourceGraphic" scale="1.4" />
    </filter>
    <filter id="oniria-rough">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.05"
        numOctaves="2"
        seed="7"
      />
      <feDisplacementMap in="SourceGraphic" scale="2" />
    </filter>
  </svg>
);

export default SvgDefs;
