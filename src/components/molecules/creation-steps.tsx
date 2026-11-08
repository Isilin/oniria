'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { ReactNode } from 'react';
import { CREATION_STEPS } from '@/lib/sheet/display';
import Written from '../atoms/written';

export type CreationStep = 1 | 2 | 3;

type State = 'done' | 'current' | 'todo';

/**
 * La marque d'une étape : un cercle imprimé avec son numéro ; une fois
 * l'étape faite, une coche tracée à la plume, comme une case remplie.
 */
const Marker = ({ n, state }: { n: number; state: State }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    aria-hidden
    sx={{ width: 24, height: 24, flexShrink: 0, overflow: 'visible' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="var(--mui-palette-text-primary)"
      strokeWidth={state === 'current' ? 1.5 : 1}
      opacity={state === 'todo' ? 0.45 : 1}
    />
    {state === 'done' ? (
      // La coche s'écrit quand l'étape vient d'être faite (`Written`).
      <path
        d="M6.5 12.5 10.5 16.5 18 7.5"
        fill="none"
        stroke="var(--mui-palette-primary-main)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fontFamily="var(--font-type), 'Courier Prime', monospace"
        fontWeight="700"
        fontSize="12"
        fill={
          state === 'current'
            ? 'var(--mui-palette-text-primary)'
            : 'var(--mui-palette-text-secondary)'
        }
      >
        {n}
      </text>
    )}
  </Box>
);

const STATE_LABEL: Record<State, string> = {
  done: 'fait',
  current: 'en cours',
  todo: 'à venir',
};

interface Props {
  step: CreationStep;
  /** Ce qui accompagne chaque étape (une ligne, un bouton), par numéro. */
  details?: Partial<Record<CreationStep, ReactNode>>;
}

/**
 * Une fiche en création, en trois temps imprimés sur la feuille : l'étape
 * en cours est en encre d'imprimerie, celles à venir en encre pâle, celles
 * faites cochées à la plume.
 */
const CreationSteps = ({ step, details = {} }: Props) => (
  <Box
    component="ol"
    sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', rowGap: 1.25 }}
  >
    {CREATION_STEPS.map((label, index) => {
      const n = (index + 1) as CreationStep;
      const state: State = n < step ? 'done' : n === step ? 'current' : 'todo';
      return (
        <Box
          component="li"
          key={label}
          aria-current={state === 'current' ? 'step' : undefined}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
            columnGap: 1.5,
            alignItems: 'start',
          }}
        >
          <Written value={state === 'done'}>
            <Marker n={n} state={state} />
          </Written>
          <Box sx={{ minWidth: 0, pt: '2px' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: state === 'current' ? 700 : 400,
                color: state === 'todo' ? 'text.secondary' : 'text.primary',
              }}
            >
              {label}
              <Box component="span" sx={visuallyHidden}>
                {` (${STATE_LABEL[state]})`}
              </Box>
            </Typography>
            {details[n] && <Box sx={{ mt: 0.5 }}>{details[n]}</Box>}
          </Box>
        </Box>
      );
    })}
  </Box>
);

export default CreationSteps;
