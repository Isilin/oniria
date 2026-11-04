'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { MouseEvent, PointerEvent, ReactNode, useEffect, useRef } from 'react';

/** Maj+clic : 5 points d'un coup. */
const BIG_STEP = 5;
/** Appui long : première répétition, puis de plus en plus vite. */
const FIRST_DELAY = 400;
const MIN_DELAY = 40;

/**
 * Un bouton qui agit au clic (Maj : ×5) et se répète, de plus en plus vite,
 * tant qu'on le maintient.
 */
const RepeatButton = ({
  label,
  disabled,
  faded,
  onStep,
  children,
}: {
  label: string;
  disabled: boolean;
  /** Discret tant qu'on ne le survole pas (« − » sans point en attente). */
  faded?: boolean;
  onStep: (count: number) => void;
  children: ReactNode;
}) => {
  const timer = useRef<number | null>(null);
  // Un appui long a déjà agi : le clic qui le termine ne compte pas.
  const repeated = useRef(false);
  const step = useRef(onStep);
  useEffect(() => {
    step.current = onStep;
  }, [onStep]);

  const stop = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    if (disabled) stop();
  }, [disabled]);
  useEffect(() => stop, []);

  const start = (e: PointerEvent) => {
    if (e.button !== 0) return;
    stop();
    repeated.current = false;
    let delay = FIRST_DELAY;
    const tick = () => {
      repeated.current = true;
      step.current(1);
      delay = Math.max(MIN_DELAY, delay * 0.75);
      timer.current = window.setTimeout(tick, delay);
    };
    timer.current = window.setTimeout(tick, delay);
    // Relâché ailleurs, ou bouton désactivé entre-temps (borne atteinte).
    window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });
  };

  const click = (e: MouseEvent) => {
    if (repeated.current) {
      repeated.current = false;
      return;
    }
    onStep(e.shiftKey ? BIG_STEP : 1);
  };

  return (
    <Tooltip
      title={`${label} (Maj : ${BIG_STEP} ; maintenir pour répéter)`}
      enterDelay={600}
      arrow
    >
      <span>
        <IconButton
          size="small"
          aria-label={label}
          disabled={disabled}
          onClick={click}
          onPointerDown={start}
          onContextMenu={(e) => e.preventDefault()}
          sx={{
            p: 0.25,
            touchAction: 'manipulation',
            userSelect: 'none',
            ...(faded && {
              opacity: 0.35,
              '&:hover, &:focus-visible': { opacity: 1 },
            }),
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

interface Props {
  /** Nom du caractère, pour les libellés des boutons. */
  label: string;
  /** Points en attente (négatif pour une baisse). */
  points: number;
  canAdd: boolean;
  canRemove: boolean;
  onStep: (step: number) => void;
}

/**
 * Ajout de points à un caractère, comme dans un jeu : « + », puis
 * « − n + » tant que des points sont en attente.
 */
const PointStepper = ({ label, points, canAdd, canRemove, onStep }: Props) => (
  <Box
    component="span"
    sx={{ display: 'inline-flex', alignItems: 'center', alignSelf: 'center' }}
  >
    {(points !== 0 || canRemove) && (
      <RepeatButton
        label={`Retirer un point à ${label}`}
        disabled={!canRemove}
        faded={points === 0}
        onStep={(count) => onStep(-count)}
      >
        <RemoveIcon fontSize="inherit" />
      </RepeatButton>
    )}
    {points !== 0 && (
      <Typography
        variant="body2"
        component="span"
        aria-live="polite"
        sx={{
          minWidth: 28,
          textAlign: 'center',
          fontWeight: 'bold',
          fontVariantNumeric: 'tabular-nums',
          color: points > 0 ? 'success.main' : 'warning.main',
        }}
      >
        {points > 0 ? `+${points}` : `−${-points}`}
      </Typography>
    )}
    <RepeatButton
      label={`Ajouter un point à ${label}`}
      disabled={!canAdd}
      onStep={onStep}
    >
      <AddIcon fontSize="inherit" />
    </RepeatButton>
  </Box>
);

export default PointStepper;
