'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { MouseEvent, PointerEvent, ReactNode, useEffect, useRef } from 'react';
import StepperFrame, {
  stepperCell,
  stepperIconSize,
} from '../atoms/stepper-frame';

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
    >
      <Box component="span" sx={{ display: 'flex' }}>
        <ButtonBase
          aria-label={label}
          disabled={disabled}
          onClick={click}
          onPointerDown={start}
          onContextMenu={(e) => e.preventDefault()}
          sx={{
            ...stepperCell('sm'),
            touchAction: 'manipulation',
            userSelect: 'none',
            ...(faded && {
              opacity: 0.35,
              '&:hover, &.Mui-focusVisible': { opacity: 1 },
            }),
          }}
        >
          {children}
        </ButtonBase>
      </Box>
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
 * Ajout de points à un caractère, comme dans un jeu, dans le cadre −|+ des
 * lunes. Toujours deux cases, pour que les valeurs restent en colonne : le
 * « − » est éteint tant qu'il n'y a rien à retirer.
 */
const PointStepper = ({ label, points, canAdd, canRemove, onStep }: Props) => (
  <StepperFrame sx={{ alignSelf: 'center' }}>
    <RepeatButton
      label={`Retirer un point à ${label}`}
      disabled={!canRemove}
      // Retirer sous la valeur enregistrée (MJ, création) reste discret.
      faded={points === 0 && canRemove}
      onStep={(count) => onStep(-count)}
    >
      <RemoveIcon sx={{ fontSize: stepperIconSize('sm') }} />
    </RepeatButton>
    <RepeatButton
      label={`Ajouter un point à ${label}`}
      disabled={!canAdd}
      onStep={onStep}
    >
      <AddIcon sx={{ fontSize: stepperIconSize('sm') }} />
    </RepeatButton>
  </StepperFrame>
);

/**
 * Les points en attente d'un caractère (« +2 », « −1 »), devant sa valeur.
 * Toujours présent, vide sans point en attente, pour être annoncé.
 */
export const PendingPoints = ({ points }: { points: number }) => (
  <Typography
    variant="caption"
    component="span"
    aria-live="polite"
    sx={{
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      color: points > 0 ? 'success.main' : 'warning.main',
    }}
  >
    {points === 0 ? '' : points > 0 ? `+${points}` : `−${-points}`}
  </Typography>
);

export default PointStepper;
