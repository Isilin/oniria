import Box from '@mui/material/Box';
import { litPath, MOON_PHASES } from '@/lib/sky';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * Ornements du carnet : imprimés (sphère armillaire, fleuron, phases de
 * lune, constellation) à l'encre d'imprimerie, et croquis à la plume (lune
 * hachurée, trajet en pointillés) à l'encre bleue. Tous décoratifs.
 */

const PRINT = 'var(--mui-palette-text-primary)';
const PEN = 'var(--mui-palette-primary-main)';

type Props = { sx?: SxProps<Theme> };

/** Petite sphère armillaire, devant les titres de section. */
export const Armillary = ({ sx }: Props) => (
  <Box
    component="svg"
    viewBox="0 0 20 20"
    aria-hidden
    sx={[
      { width: 18, height: 18, flexShrink: 0 },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <circle
      cx="10"
      cy="10"
      r="8"
      fill="none"
      stroke={PRINT}
      strokeWidth="0.9"
    />
    <ellipse
      cx="10"
      cy="10"
      rx="8"
      ry="3"
      fill="none"
      stroke={PRINT}
      strokeWidth="0.8"
    />
    <ellipse
      cx="10"
      cy="10"
      rx="3"
      ry="8"
      fill="none"
      stroke={PRINT}
      strokeWidth="0.8"
    />
    <circle cx="10" cy="10" r="1.4" fill={PRINT} />
  </Box>
);

/** Fleuron : une lune entre deux filets, de part et d'autre d'un titre. */
export const Fleuron = ({ sx }: Props) => (
  <Box
    component="svg"
    viewBox="0 0 28 12"
    aria-hidden
    sx={[
      { width: 28, height: 12, flexShrink: 0 },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <path d="M1 6h8M19 6h8" stroke={PRINT} strokeWidth="0.8" />
    <circle
      cx="14"
      cy="6"
      r="3.4"
      fill="none"
      stroke={PRINT}
      strokeWidth="0.8"
    />
    <path d="M14 2.6 a3.4 3.4 0 0 1 0 6.8 a2 3.4 0 0 0 0 -6.8" fill={PRINT} />
  </Box>
);

/** Les phases de la lune en frise, au bandeau-titre. */
export const MoonPhases = ({ sx }: Props) => (
  <Box
    component="svg"
    viewBox="0 0 190 22"
    aria-hidden
    sx={[
      { width: 190, height: 22, flexShrink: 0 },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {MOON_PHASES.map((fraction, i) => {
      const cx = 11 + i * 21;
      const lit = litPath(fraction, cx, 11, 6.5);
      return (
        <g key={i}>
          <circle
            cx={cx}
            cy="11"
            r="6.5"
            fill="none"
            stroke={PRINT}
            strokeWidth="0.8"
          />
          {lit && <path d={lit} fill={PRINT} />}
        </g>
      );
    })}
  </Box>
);

/** Lune croquée à la plume : un cercle tremblé, hachuré sur un côté. */
export const SketchMoon = ({ size = 34, sx }: Props & { size?: number }) => (
  <Box
    component="svg"
    viewBox="0 0 46 46"
    aria-hidden
    sx={[
      { width: size, height: size, flexShrink: 0, overflow: 'visible' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <defs>
      <pattern
        id="oniria-hatch"
        width="3"
        height="3"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(30)"
      >
        <line x1="0" y1="0" x2="0" y2="3" stroke={PEN} strokeWidth="0.8" />
      </pattern>
      <clipPath id="oniria-sketch-clip">
        <circle cx="23" cy="23" r="17" />
      </clipPath>
    </defs>
    <g filter="url(#oniria-rough)" opacity="0.85">
      <circle
        cx="23"
        cy="23"
        r="17"
        fill="none"
        stroke={PEN}
        strokeWidth="1.2"
      />
      <circle
        cx="32"
        cy="23"
        r="17"
        fill="url(#oniria-hatch)"
        clipPath="url(#oniria-sketch-clip)"
      />
      <circle
        cx="17"
        cy="19"
        r="2.7"
        fill="none"
        stroke={PEN}
        strokeWidth="0.8"
      />
    </g>
  </Box>
);

/** Trajet en pointillés entre deux lunes, tracé à la plume. */
export const DottedPath = ({ sx }: Props) => (
  <Box
    component="svg"
    viewBox="0 0 300 40"
    preserveAspectRatio="none"
    aria-hidden
    sx={[
      { display: 'block', overflow: 'visible' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <path
      d="M4 22 C 70 2, 170 40, 292 10"
      fill="none"
      stroke={PEN}
      strokeWidth="1.1"
      strokeDasharray="2 6"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      opacity="0.75"
    />
    <circle
      cx="292"
      cy="10"
      r="3.2"
      fill="none"
      stroke={PEN}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </Box>
);

const STARS: [number, number][] = [
  [20, 30],
  [70, 12],
  [118, 40],
  [168, 22],
  [214, 58],
  [180, 92],
];

/** Constellation imprimée, pâle, dans les blancs de la page. */
export const Constellation = ({ label, sx }: Props & { label?: string }) => (
  <Box
    component="svg"
    viewBox="0 0 240 120"
    aria-hidden
    sx={[
      { width: 240, height: 120, display: 'block' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <polyline
      points={STARS.map((p) => p.join(',')).join(' ')}
      fill="none"
      stroke={PRINT}
      strokeWidth="0.6"
      opacity="0.4"
    />
    {STARS.map(([x, y], i) => (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={i % 2 ? 1.5 : 2.4}
        fill={PRINT}
        opacity="0.55"
      />
    ))}
    {label && (
      <text
        x="20"
        y="52"
        fontFamily="var(--font-type), monospace"
        fontSize="9"
        letterSpacing="2"
        fill={PRINT}
        opacity="0.55"
      >
        {label}
      </text>
    )}
  </Box>
);
