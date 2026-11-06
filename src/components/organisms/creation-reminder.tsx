'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { creationStep } from '@/lib/rules/xp';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CREATION_STEP_SHORT } from '../molecules/creation-steps';

/**
 * Tant que la fiche est en création, une ligne sous les Existences dit où
 * elle en est et mène aux trois temps, en bas de l'onglet Caractéristiques
 * (sous la ligne de flottaison d'un écran de portable).
 */
const CreationReminder = ({ id }: { id: string }) => {
  const { xpPreview, canEdit } = useSheet(id);
  const step = xpPreview ? creationStep(xpPreview) : null;
  if (!canEdit || step === null) return null;

  const scrollToSteps = () =>
    requestAnimationFrame(() => {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      document.getElementById('experience')?.scrollIntoView({
        block: 'start',
        behavior: reduce ? 'auto' : 'smooth',
      });
    });

  const showSteps = () => {
    if (window.location.hash === '#0') return scrollToSteps();
    // L'onglet Caractéristiques s'affiche au changement d'ancre ; la section
    // Expérience n'existe qu'ensuite.
    window.addEventListener('hashchange', scrollToSteps, { once: true });
    window.location.hash = '0';
  };

  return (
    <Alert
      severity="info"
      sx={{
        width: '100%',
        py: 0,
        alignItems: 'center',
        '& .MuiAlert-message': { flex: 1, minWidth: 0 },
      }}
    >
      {/* Le bouton suit la phrase et passe dessous, à droite, sur téléphone. */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 2,
        }}
      >
        <span>
          {/* Espaces insécables : ni « · » ni « : » en début de ligne. */}
          Fiche en création{'\u00a0'}· étape {step} sur 3{'\u00a0'}:{' '}
          {CREATION_STEP_SHORT[step - 1]}.
        </span>
        <Button
          color="inherit"
          size="small"
          onClick={showSteps}
          sx={{ ml: 'auto', whiteSpace: 'nowrap' }}
        >
          Voir les étapes
        </Button>
      </Box>
    </Alert>
  );
};

export default CreationReminder;
