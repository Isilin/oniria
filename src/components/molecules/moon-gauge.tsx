'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, ButtonBase, Tooltip, Typography } from '@mui/material';

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
  /** Disque plus petit (le Maï, à côté des trois Existences). */
  small?: boolean;
  /** −|+ sur la même ligne que la valeur, à toutes les largeurs. */
  inline?: boolean;
  /** Libellé masqué là où une légende de la bande le porte déjà (≥ 520 px). */
  labelHiddenWide?: boolean;
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
  if (fraction <= 0 || fraction >= 1) return null;
  const rx = DISC * Math.abs(1 - 2 * fraction);
  return `M ${C} ${C - DISC} A ${DISC} ${DISC} 0 0 1 ${C} ${C + DISC} A ${rx.toFixed(2)} ${DISC} 0 0 ${fraction > 0.5 ? 1 : 0} ${C} ${C - DISC} Z`;
};

/** − et + joints, comme une case d'éphéméride : l'or de lampe au survol. */
const Stepper = ({
  label,
  onStep,
}: {
  label: string;
  onStep: (delta: number) => void;
}) => {
  const half = {
    width: 34,
    height: 32,
    color: 'text.secondary',
    transition: 'color 120ms ease-out, background-color 120ms ease-out',
    '&:hover, &.Mui-focusVisible': {
      color: 'primary.main',
      bgcolor:
        'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)',
    },
  };
  return (
    <Box
      sx={{
        gridArea: 'step',
        display: 'inline-flex',
        alignSelf: 'center',
        justifySelf: 'start',
        border: 1,
        borderColor: 'rule',
        borderRadius: 0.5,
        overflow: 'hidden',
      }}
    >
      <ButtonBase
        aria-label={`Retirer un point : ${label}`}
        onClick={() => onStep(-1)}
        sx={half}
      >
        <RemoveIcon sx={{ fontSize: 18 }} />
      </ButtonBase>
      <Box sx={{ width: '1px', bgcolor: 'rule' }} />
      <ButtonBase
        aria-label={`Ajouter un point : ${label}`}
        onClick={() => onStep(1)}
        sx={half}
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </ButtonBase>
    </Box>
  );
};

/**
 * Une Existence comme une phase de lune : le disque s'éclaire selon la
 * valeur, l'arc compte les points (un trait par point), −/+ en un geste.
 * La phase et l'arc glissent vers leur nouvelle valeur.
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
  small = false,
  inline = false,
  labelHiddenWide = false,
}: Props) => {
  const fraction = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  const lit = litPath(fraction);
  const track = 'var(--mui-palette-rule)';
  const ticks = Math.max(0, Math.round(max));
  const segmented = ticks > 0 && ticks <= MAX_TICKS;
  const span = segmented ? ARC_SPAN / ticks : ARC_SPAN;
  const gap = segmented ? Math.min(6, span * 0.35) : 0;
  // Même boîte pour toutes les lunes (les valeurs restent sur une ligne) ;
  // le Maï est seulement dessiné plus petit à l'intérieur.
  const disc = { xs: 34, md: 60 };
  const viewBox = small
    ? `-10 -10 ${SIZE + 20} ${SIZE + 20}`
    : `0 0 ${SIZE} ${SIZE}`;
  const stepper = editable && onChange;

  const labelNode = (
    <Typography
      variant="overline"
      component="span"
      color="textSecondary"
      tabIndex={hint ? 0 : undefined}
      noWrap
      sx={{
        display: 'block',
        // Sur téléphone, le libellé doit tenir en entier : « L'Équilibre ».
        fontSize: { xs: '0.6875rem', md: '0.8125rem' },
        letterSpacing: { xs: '0.03em', md: '0.08em' },
        ...(hint && { cursor: 'help' }),
        ...(labelHiddenWide && {
          // Masqué mais présent : la valeur reste sur la ligne des autres.
          '@media (min-width: 520px)': { visibility: 'hidden' },
        }),
      }}
    >
      {label}
    </Typography>
  );

  return (
    <Box
      role="group"
      aria-label={`${label} : ${current} sur ${max}`}
      sx={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'start',
        columnGap: 1,
        rowGap: 0.5,
        minWidth: 0,
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        gridTemplateAreas: '"disc text"',
        ...(stepper && {
          // −|+ sous la valeur quand la colonne est étroite ; à côté sinon
          // (sur une ligne entière au téléphone, et dès 1200 px).
          gridTemplateAreas: inline
            ? '"disc text step"'
            : '"disc text" "step step"',
          gridTemplateColumns: inline
            ? 'auto minmax(0, max-content) auto'
            : 'auto minmax(0, 1fr)',
          '@media (min-width: 520px)': {
            gridTemplateAreas: '"disc text" "step step"',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
          },
          // Écrit en clair (et non theme.breakpoints) pour venir après la règle
          // des 520 px : MUI range ses propres paliers en premier.
          '@media (min-width: 1200px)': {
            columnGap: 2,
            gridTemplateAreas: '"disc text step"',
            // Les −|+ suivent la valeur au lieu d'être rejetés en bout de colonne.
            gridTemplateColumns: 'auto minmax(0, max-content) auto',
          },
        }),
      }}
    >
      <Box
        component="svg"
        viewBox={viewBox}
        aria-hidden
        sx={{
          gridArea: 'disc',
          width: disc,
          height: disc,
          overflow: 'visible',
          '& .moon-anim': {
            transition:
              'stroke 200ms ease-out, d 260ms cubic-bezier(0.22, 1, 0.36, 1)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '& .moon-anim': { transition: 'none' },
          },
        }}
      >
        {segmented ? (
          Array.from({ length: ticks }, (_, i) => {
            const from = ARC_START + i * span + gap / 2;
            return (
              <path
                key={i}
                className="moon-anim"
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
                className="moon-anim"
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
        {lit && <path className="moon-anim" d={lit} fill={color} />}
      </Box>
      <Box sx={{ gridArea: 'text', minWidth: 0 }}>
        {hint ? (
          <Tooltip title={`Maximum : ${hint}`} describeChild>
            {labelNode}
          </Tooltip>
        ) : (
          labelNode
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            columnGap: 0.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="numeral"
            sx={{ fontSize: { xs: '1.25rem', md: '1.625rem' } }}
          >
            {current}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            / {max}
          </Typography>
          {threshold !== undefined && (
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ ml: 0.5, whiteSpace: 'nowrap' }}
            >
              seuil {threshold}
            </Typography>
          )}
        </Box>
      </Box>
      {stepper && (
        <Stepper label={label} onStep={(d) => onChange(current + d)} />
      )}
    </Box>
  );
};

export default MoonGauge;
