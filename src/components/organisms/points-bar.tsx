'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTIC_BY_KEY } from '@/lib/rules';
import { SCOPE_BY_KEY, Scope } from '@/lib/rules/xp';
import { EASE, EASE_LEAVE, MOTION } from '@/theme/theme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';

const signed = (value: number) => (value > 0 ? `+${value}` : `−${-value}`);

/**
 * Points en attente sur les caractères : ce qu'ils coûtent, et de quoi les
 * valider ou les annuler. Reste en bas de l'écran pendant qu'on parcourt
 * l'aperçu du reste de la fiche. Elle glisse depuis le bas comme une feuille
 * qu'on pose, et repart plus vite (un simple fondu en mouvement réduit).
 */
const PointsBar = ({ id }: { id: string }) => {
  const { points, isAdmin } = useSheet(id);
  const [saving, setSaving] = useState(false);
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { plan } = points;
  const open = !!plan && plan.lines.length > 0;

  // Le dernier plan reste affiché pendant que la barre repart.
  const [shown, setShown] = useState(plan);
  if (open && plan !== shown) setShown(plan);
  const current = open ? plan : shown;

  let bar = <Box />;
  if (current && current.lines.length > 0) {
    const taken = current.removals.reduce((t, r) => t - r.line.delta, 0);
    const details = [
      current.cost > 0 && `Coût : ${current.cost} XP`,
      taken > 0 && `reprise : ${taken} XP`,
      current.freeCost !== 0 &&
        `${signed(current.freeCost)} XP à payer à la validation de la fiche`,
    ].filter(Boolean);
    const missing =
      current.missing > 0 &&
      `XP insuffisante : il manque ${current.missing} XP (${Object.entries(
        current.missingByScope,
      )
        .map(([s, m]) => `${SCOPE_BY_KEY[s as Scope].label} ${m}`)
        .join(', ')}).${isAdmin ? ' Le MJ peut les offrir.' : ''}`;

    const commit = async () => {
      setSaving(true);
      await points.commit();
      setSaving(false);
    };

    bar = (
      // Une surface relevée cernée d'un filet, sans ombre, collée en bas de
      // l'écran.
      <Box
        role="region"
        aria-label="Points en attente"
        sx={{
          position: 'sticky',
          bottom: 16,
          zIndex: 'appBar',
          width: '100%',
          p: 1.5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          bgcolor: 'raised',
          border: 1,
          borderRadius: 1,
          borderColor: missing ? 'error.main' : 'success.main',
          transition: `border-color ${MOTION.state}ms ease-out`,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {current.lines
              .map(
                (l) =>
                  `${CHARACTERISTIC_BY_KEY[l.key].label} ${signed(l.to - l.from)}`,
              )
              .join(' · ')}
          </Typography>
          <Typography
            variant="body2"
            color={missing ? 'error' : 'textSecondary'}
            aria-live="polite"
          >
            {missing || details.join(' · ')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button onClick={points.clear} disabled={saving || !open}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={commit}
            disabled={saving || !open || (!!missing && !isAdmin)}
          >
            Valider
          </Button>
        </Box>
      </Box>
    );
  }

  return reduce ? (
    <Fade
      in={open}
      appear
      mountOnEnter
      unmountOnExit
      timeout={{ enter: 200, exit: 120 }}
    >
      {bar}
    </Fade>
  ) : (
    <Slide
      in={open}
      direction="up"
      appear
      mountOnEnter
      unmountOnExit
      timeout={{ enter: MOTION.arrive, exit: MOTION.leave }}
      easing={{ enter: EASE, exit: EASE_LEAVE }}
    >
      {bar}
    </Slide>
  );
};

export default PointsBar;
