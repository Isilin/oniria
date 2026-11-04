'use client';

import { Box, SxProps, Theme } from '@mui/material';

interface Props {
  avatar?: string | null;
  name?: string | null;
  /** Taille en pixels de la planète (sans image) ou du portrait rond. */
  size: number | { xs: number; md: number };
  /**
   * Dans le cadre imprimé de la plaque : l'image remplit le cadre, et sans
   * image le personnage est une petite planète sur son orbite.
   */
  framed?: boolean;
  sx?: SxProps<Theme>;
}

const PRINT = 'var(--mui-palette-text-primary)';
const PEN = 'var(--mui-palette-primary-main)';

/**
 * Le portrait d'un personnage. Sans image, une lune au lavis de sa teinte
 * (variable CSS `--tint`) porte l'initiale de son nom, écrite à la main.
 */
const Portrait = ({ avatar, name, size, framed = false, sx }: Props) => {
  const extra = Array.isArray(sx) ? sx : [sx];

  if (avatar) {
    return (
      <Box
        component="img"
        src={avatar}
        alt={`Portrait de ${name ?? 'ce personnage'}`}
        loading="lazy"
        decoding="async"
        sx={[
          {
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'top',
            flexShrink: 0,
            ...(framed
              ? { width: '100%', height: '100%' }
              : { width: size, height: size, borderRadius: '50%' }),
          },
          ...extra,
        ]}
      />
    );
  }

  const initial = (name ?? '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <Box
      component="svg"
      viewBox="0 0 80 80"
      role="img"
      aria-label={`${name ?? 'Personnage'} (sans portrait)`}
      sx={[
        { width: size, height: size, flexShrink: 0, overflow: 'visible' },
        ...extra,
      ]}
    >
      {framed && (
        <ellipse
          cx="40"
          cy="40"
          rx="39"
          ry="13"
          transform="rotate(-18 40 40)"
          fill="none"
          stroke={PRINT}
          strokeWidth="0.7"
          strokeDasharray="1.5 3"
          opacity="0.6"
        />
      )}
      <circle
        cx="40"
        cy="40"
        r="30"
        fill="var(--tint, currentColor)"
        fillOpacity="0.3"
        filter="url(#oniria-wash)"
      />
      <circle
        cx="40"
        cy="40"
        r="28"
        fill="none"
        stroke={PRINT}
        strokeWidth="1.2"
      />
      <text
        x="40"
        y="53"
        textAnchor="middle"
        fontFamily="var(--font-hand), cursive"
        fontWeight="700"
        fontSize="36"
        fill={PEN}
      >
        {initial}
      </text>
    </Box>
  );
};

export default Portrait;
