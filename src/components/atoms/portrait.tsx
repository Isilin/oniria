'use client';

import { Box, SxProps, Theme } from '@mui/material';

interface Props {
  avatar?: string | null;
  name?: string | null;
  /** Taille en pixels (le portrait est rond). */
  size: number | { xs: number; md: number };
  sx?: SxProps<Theme>;
}

/**
 * Le portrait d'un personnage, rond. Sans image, une lune teintée porte
 * l'initiale de son nom (la teinte vient de la variable CSS `--tint`).
 */
const Portrait = ({ avatar, name, size, sx }: Props) => {
  const base = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
  };

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
            ...base,
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'top',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
    );
  }

  const initial = (name ?? '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <Box
      role="img"
      aria-label={`${name ?? 'Personnage'} (sans portrait)`}
      sx={[
        {
          ...base,
          display: 'grid',
          placeItems: 'center',
          bgcolor:
            'color-mix(in srgb, var(--tint, currentColor) 16%, transparent)',
          color: 'var(--tint, currentColor)',
          fontFamily: 'var(--font-spectral), Georgia, serif',
          fontWeight: 500,
          fontSize:
            typeof size === 'number'
              ? size * 0.42
              : { xs: size.xs * 0.42, md: size.md * 0.42 },
          lineHeight: 1,
          userSelect: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {initial}
    </Box>
  );
};

export default Portrait;
