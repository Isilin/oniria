'use client';

import { MEDIA, MOTION, RULES } from '@/theme/theme';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';

export type StepperSize = 'md' | 'sm';

/** md : les lunes de la bande ; sm : les lignes de caractères (24 px, cible minimale). */
const CELL = {
  md: { width: 34, height: 32, icon: 18 },
  sm: { width: 24, height: 24, icon: 16 },
} as const;

/** Au doigt (écran tactile), des cases de 44 px : on ne vise pas. */
const CELL_TOUCH = {
  md: { width: 44, height: 44 },
  sm: { width: 44, height: 44 },
} as const;

export const stepperIconSize = (size: StepperSize) => CELL[size].icon;

/** Une case de −|+ : argent au repos, or de lampe au survol ou au focus. */
export const stepperCell = (size: StepperSize) => ({
  width: CELL[size].width,
  height: CELL[size].height,
  [MEDIA.touch]: CELL_TOUCH[size],
  borderRadius: 0,
  color: 'text.secondary',
  transition: `color ${MOTION.quick}ms ease-out, background-color ${MOTION.quick}ms ease-out, opacity ${MOTION.quick}ms ease-out`,
  '&:hover, &.Mui-focusVisible': {
    color: 'primary.main',
    bgcolor:
      'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)',
  },
  // L'anneau de focus reste à l'intérieur du cadre, qui rogne ses bords.
  '&.Mui-focusVisible': {
    outline: '2px solid var(--mui-palette-primary-main)',
    outlineOffset: '-2px',
  },
  '&.Mui-disabled': { color: 'text.disabled' },
});

/**
 * Le cadre joint des −|+ : filet d'un pixel, coins de 2 px, cases séparées
 * par un filet. Le même partout où l'on ajoute ou retire des points.
 */
const StepperFrame = ({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) => (
  <Box
    sx={[
      {
        display: 'inline-flex',
        flexShrink: 0,
        border: RULES.hairline,
        borderRadius: 1,
        overflow: 'hidden',
        '& > * + *': { borderLeft: RULES.hairline },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Box>
);

export default StepperFrame;
