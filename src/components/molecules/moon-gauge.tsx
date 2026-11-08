'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, ButtonBase, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import {
  litPath,
  PLANET,
  planetArc,
  planetDots,
  planetFraction,
} from '@/lib/sky';
import { EASE, MEDIA, MOTION } from '@/theme/theme';
import PreviewValue from '../atoms/preview-value';
import Written from '../atoms/written';
import StepperFrame, {
  stepperCell,
  stepperIconSize,
} from '../atoms/stepper-frame';

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
  /** Planète plus petite (le Maï, à côté des trois Existences). */
  small?: boolean;
  /** −|+ sur la même ligne que la valeur, à toutes les largeurs. */
  inline?: boolean;
  /** Libellé masqué là où une légende de la bande le porte déjà (≥ 520 px). */
  labelHiddenWide?: boolean;
  /** Maximum et seuil de la fiche enregistrée (aperçu des points en attente). */
  before?: { max: number; threshold?: number };
}

const { C, DISC, ARC_START, ARC_SPAN } = PLANET;

const PRINT = 'var(--mui-palette-text-primary)';
const PEN = 'var(--mui-palette-primary-main)';
const PAPER = 'var(--mui-palette-background-paper)';

/** − et + joints, dans le cadre imprimé des −|+ de toute la fiche. */
const Stepper = ({
  label,
  onStep,
}: {
  label: string;
  onStep: (delta: number) => void;
}) => (
  <StepperFrame
    sx={{ gridArea: 'step', alignSelf: 'center', justifySelf: 'start' }}
  >
    <ButtonBase
      aria-label={`Retirer un point : ${label}`}
      onClick={() => onStep(-1)}
      sx={stepperCell('md')}
    >
      <RemoveIcon sx={{ fontSize: stepperIconSize('md') }} />
    </ButtonBase>
    <ButtonBase
      aria-label={`Ajouter un point : ${label}`}
      onClick={() => onStep(1)}
      sx={stepperCell('md')}
    >
      <AddIcon sx={{ fontSize: stepperIconSize('md') }} />
    </ButtonBase>
  </StepperFrame>
);

/**
 * Une Existence comme une petite planète d'atlas : imprimée sur son orbite,
 * sa part éclairée peinte au lavis selon la valeur, et un point coché à la
 * plume par point d'Existence. La valeur courante est écrite à la main ;
 * le maximum et le seuil sont tapés. −/+ en un geste.
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
  before,
}: Props) => {
  // Un point perdu (un coup reçu) : une onde d'encre part de la planète,
  // plus marquée quand l'Existence tombe à 0. Rien au premier affichage.
  const [previous, setPrevious] = useState(current);
  const [hit, setHit] = useState<{ count: number; empty: boolean } | null>(
    null,
  );
  if (current !== previous) {
    // Valeur dérivée pendant le rendu (et non dans un effet).
    setPrevious(current);
    if (current < previous) {
      setHit({ count: (hit?.count ?? 0) + 1, empty: current <= 0 });
    }
  }

  const fraction = planetFraction(current, max);
  const lit = litPath(fraction, C, C, DISC);
  const { dotted, dots } = planetDots(max, current);
  // Même boîte pour toutes les planètes (les valeurs restent sur une ligne) ;
  // le Maï est seulement dessiné plus petit à l'intérieur.
  const size = { xs: 40, md: 64 };
  const viewBox = small ? '-16 -16 96 96' : '-4 -4 72 72';
  const stepper = editable && onChange;

  const hasThreshold = threshold !== undefined;
  // Sur téléphone (trois planètes par ligne), « seuil 10 » ne tient pas à
  // côté de la planète : il passe sur sa propre ligne, sous la planète. Dès
  // 520 px, il reprend sa place après « / max ».
  const thresholdNode = (narrow: boolean) =>
    hasThreshold && (
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{
          whiteSpace: 'nowrap',
          ...(narrow
            ? {
                gridArea: 'seuil',
                display: 'block',
                [MEDIA.planetsRow]: { display: 'none' },
              }
            : {
                ml: 0.5,
                display: 'none',
                [MEDIA.planetsRow]: { display: 'inline' },
              }),
        }}
      >
        seuil{' '}
        <PreviewValue
          before={before?.threshold}
          delta={
            before?.threshold !== undefined ? threshold - before.threshold : 0
          }
        >
          {threshold}
        </PreviewValue>
      </Typography>
    );

  const labelNode = (
    <Typography
      variant="overline"
      component="span"
      color="textSecondary"
      tabIndex={hint ? 0 : undefined}
      noWrap
      sx={{
        display: 'block',
        // Taille des libellés partout ; sur téléphone (trois planètes par
        // ligne), l'espacement se resserre pour que « L'Équilibre » tienne.
        letterSpacing: '0.06em',
        [MEDIA.planetsRow]: {
          letterSpacing: '0.14em',
          // Masqué mais présent : la valeur reste sur la ligne des autres.
          ...(labelHiddenWide && { visibility: 'hidden' }),
        },
        ...(hint && { cursor: 'help' }),
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
        // Le libellé au-dessus, sur toute la largeur de la colonne (la machine
        // à écrire est large) ; à côté de la planète dès 900 px, quand la
        // colonne laisse la place à « L'Équilibre » en entier.
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        gridTemplateAreas: hasThreshold
          ? '"label label" "disc text" "seuil seuil"'
          : '"label label" "disc text"',
        // Pas de clé commune avec le cas des −|+ ci-dessous : une clé écrasée
        // garde sa place et passerait avant la règle des 520 px.
        ...(!stepper && {
          '@media (min-width: 900px)': {
            gridTemplateAreas: '"disc label" "disc text"',
          },
        }),
        ...(stepper && {
          // −|+ sous la valeur quand la colonne est étroite ; à côté sinon
          // (sur une ligne entière au téléphone, et dès 1200 px).
          gridTemplateAreas: inline
            ? '"label label label" "disc text step"'
            : hasThreshold
              ? '"label label" "disc text" "seuil seuil" "step step"'
              : '"label label" "disc text" "step step"',
          gridTemplateColumns: inline
            ? 'auto minmax(0, max-content) auto'
            : 'auto minmax(0, 1fr)',
          [MEDIA.planetsRow]: {
            gridTemplateAreas: '"label label" "disc text" "step step"',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
          },
          '@media (min-width: 900px)': {
            gridTemplateAreas: '"disc label" "disc text" "step step"',
          },
          // Écrit en clair (et non theme.breakpoints) pour venir après la règle
          // des 520 px : MUI range ses propres paliers en premier.
          '@media (min-width: 1200px)': {
            columnGap: 2,
            // Le libellé passe au-dessus des −|+ : « L'Équilibre » en entier
            // dès 1200 px, et les −|+ face à la valeur qu'ils changent.
            gridTemplateAreas: '"disc label label" "disc text step"',
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
          width: size,
          height: size,
          overflow: 'visible',
          '& .moon-anim': {
            transition: `opacity 200ms ease-out, d 260ms ${EASE}`,
          },
          // Une goutte d'encre : le point s'étale depuis son centre.
          '& .moon-dot': {
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transition: `opacity 160ms ease-out, transform ${MOTION.arrive}ms ${EASE}`,
          },
          '& .moon-dot.off': { transform: 'scale(0.2)' },
          '& .moon-ripple': {
            transformBox: 'fill-box',
            transformOrigin: 'center',
            opacity: 0,
            animation: `oniria-ripple 560ms ${EASE} both`,
          },
          // À 0, une seconde onde, plus lente.
          '& .moon-ripple.late': {
            animationDelay: '140ms',
            animationDuration: '760ms',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '& .moon-anim': { transition: 'none' },
            '& .moon-dot': { transition: 'opacity 160ms ease-out' },
            '& .moon-dot.off': { transform: 'none' },
            '& .moon-ripple': {
              animation: 'oniria-ripple-flash 360ms ease-out both',
            },
          },
        }}
      >
        <ellipse
          cx={C}
          cy={C}
          rx="31"
          ry="10.5"
          transform={`rotate(-16 ${C} ${C})`}
          fill="none"
          stroke={PRINT}
          strokeWidth="0.6"
          strokeDasharray="1.5 3"
          opacity="0.6"
        />
        <circle
          cx={C}
          cy={C}
          r={DISC + 3}
          fill={color}
          fillOpacity="0.14"
          filter="url(#oniria-wash)"
        />
        {lit && (
          <path
            className="moon-anim"
            d={lit}
            fill={color}
            fillOpacity="0.62"
            filter="url(#oniria-wash)"
          />
        )}
        <circle
          cx={C}
          cy={C}
          r={DISC}
          fill="none"
          stroke={PRINT}
          strokeWidth="1.1"
        />
        {hit && (
          // Nouvelle clé à chaque point perdu : l'onde repart.
          <g key={hit.count}>
            <circle
              className="moon-ripple"
              cx={C}
              cy={C}
              r={DISC}
              fill="none"
              stroke={color}
              strokeWidth={hit.empty ? 2 : 1.2}
              vectorEffect="non-scaling-stroke"
            />
            {hit.empty && (
              <circle
                className="moon-ripple late"
                cx={C}
                cy={C}
                r={DISC}
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        )}
        {dotted ? (
          dots.map(({ x, y, filled }, i) => {
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="3.3"
                  fill={PAPER}
                  stroke={PRINT}
                  strokeWidth="0.9"
                />
                <circle
                  className={filled ? 'moon-dot' : 'moon-dot off'}
                  cx={x}
                  cy={y}
                  r="2.2"
                  fill={PEN}
                  filter="url(#oniria-ink)"
                  opacity={filled ? 1 : 0}
                />
              </g>
            );
          })
        ) : (
          <>
            <path
              d={planetArc(ARC_START, ARC_START + ARC_SPAN)}
              fill="none"
              stroke={PRINT}
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            {fraction > 0 && (
              <path
                className="moon-anim"
                d={planetArc(ARC_START, ARC_START + ARC_SPAN * fraction)}
                fill="none"
                stroke={PEN}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            )}
          </>
        )}
      </Box>
      <Box sx={{ gridArea: 'label', minWidth: 0, alignSelf: 'end' }}>
        {hint ? (
          <Tooltip title={`Maximum : ${hint}`} describeChild>
            {labelNode}
          </Tooltip>
        ) : (
          labelNode
        )}
      </Box>
      <Box sx={{ gridArea: 'text', minWidth: 0, alignSelf: 'start' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            columnGap: 0.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="handExistence">
            <Written value={current}>{current}</Written>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
            /{' '}
            <PreviewValue
              before={before?.max}
              delta={before ? max - before.max : 0}
            >
              {max}
            </PreviewValue>
          </Typography>
          {thresholdNode(false)}
        </Box>
      </Box>
      {thresholdNode(true)}
      {stepper && (
        <Stepper label={label} onStep={(d) => onChange(current + d)} />
      )}
    </Box>
  );
};

export default MoonGauge;
