'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

/** Mélange compatible avec les variables CSS du thème (nuit / jour). */
const mix = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

interface Props {
  label: string;
  current: number;
  max: number;
  threshold?: number;
  /** Couleur de l'existence : une variable du thème (vars.palette.existence.*). */
  color: string;
  /** Règle de calcul du maximum, en infobulle sur le libellé. */
  hint?: string;
  editable?: boolean;
  onChange?: (value: number) => void;
}

const SIZE = 64;
const C = SIZE / 2;
const DISC = 17;
const ARC = 27;
/** L'arc fait les trois quarts du tour, ouvert en bas. */
const ARC_START = 135;
const ARC_SPAN = 270;
/** Au-delà, les traits seraient trop fins : l'arc devient continu. */
const MAX_TICKS = 24;

const point = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return `${(C + radius * Math.cos(rad)).toFixed(2)} ${(C + radius * Math.sin(rad)).toFixed(2)}`;
};

const arc = (from: number, to: number) =>
  `M ${point(from, ARC)} A ${ARC} ${ARC} 0 ${to - from > 180 ? 1 : 0} 1 ${point(to, ARC)}`;

/** Partie éclairée d'une lune : croissant à droite, puis gibbeuse. */
const litPath = (fraction: number) => {
  if (fraction <= 0) return null;
  if (fraction >= 1) return null;
  const rx = DISC * Math.abs(1 - 2 * fraction);
  return `M ${C} ${C - DISC} A ${DISC} ${DISC} 0 0 1 ${C} ${C + DISC} A ${rx.toFixed(2)} ${DISC} 0 0 ${fraction > 0.5 ? 1 : 0} ${C} ${C - DISC} Z`;
};

/**
 * Une Existence comme une phase de lune : le disque s'éclaire selon la
 * valeur, l'arc compte les points (un trait par point), −/+ en un geste.
 */
const MoonGauge = ({
  label,
  current,
  max,
  threshold,
  color,
  hint,
  editable = false,
  onChange,
}: Props) => {
  const fraction = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  const lit = litPath(fraction);
  const track = 'var(--mui-palette-rule)';
  const ticks = Math.max(0, Math.round(max));
  const segmented = ticks > 0 && ticks <= MAX_TICKS;
  const span = segmented ? ARC_SPAN / ticks : ARC_SPAN;
  const gap = segmented ? Math.min(6, span * 0.35) : 0;

  const labelNode = (
    <Typography
      variant="overline"
      component="span"
      color="textSecondary"
      tabIndex={hint ? 0 : undefined}
      sx={hint ? { cursor: 'help' } : undefined}
    >
      {label}
    </Typography>
  );

  return (
    <Box
      role="group"
      aria-label={`${label} : ${current} sur ${max}`}
      sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}
    >
      <Box
        component="svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden
        sx={{
          width: { xs: 46, sm: SIZE },
          height: { xs: 46, sm: SIZE },
          flexShrink: 0,
          overflow: 'visible',
        }}
      >
        {segmented ? (
          Array.from({ length: ticks }, (_, i) => {
            const from = ARC_START + i * span + gap / 2;
            return (
              <path
                key={i}
                d={arc(from, from + span - gap)}
                fill="none"
                stroke={i < current ? color : track}
                strokeWidth={3}
              />
            );
          })
        ) : (
          <>
            <path
              d={arc(ARC_START, ARC_START + ARC_SPAN)}
              fill="none"
              stroke={track}
              strokeWidth={3}
            />
            {fraction > 0 && (
              <path
                d={arc(ARC_START, ARC_START + ARC_SPAN * fraction)}
                fill="none"
                stroke={color}
                strokeWidth={3}
              />
            )}
          </>
        )}
        <circle
          cx={C}
          cy={C}
          r={DISC}
          fill={mix(color, 10)}
          stroke={mix(color, 45)}
          strokeWidth={1}
        />
        {fraction >= 1 && <circle cx={C} cy={C} r={DISC} fill={color} />}
        {lit && <path d={lit} fill={color} />}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {hint ? (
          <Tooltip title={`Maximum : ${hint}`} describeChild>
            {labelNode}
          </Tooltip>
        ) : (
          labelNode
        )}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            variant="numeral"
            sx={{ fontSize: { xs: '1.375rem', sm: '1.75rem' } }}
          >
            {current}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            / {max}
          </Typography>
        </Box>
        {threshold !== undefined && (
          <Typography variant="caption" color="textSecondary" component="p">
            seuil {threshold}
          </Typography>
        )}
      </Box>
      {editable && onChange && (
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0.5 }}>
          <IconButton
            size="small"
            aria-label={`Ajouter un point : ${label}`}
            onClick={() => onChange(current + 1)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label={`Retirer un point : ${label}`}
            onClick={() => onChange(current - 1)}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default MoonGauge;
