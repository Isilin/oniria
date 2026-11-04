'use client';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { MOTION } from '@/theme/theme';
import { ReactNode } from 'react';

interface Props {
  /** Valeur avec les points en attente. */
  children: ReactNode;
  /** Valeur de la fiche enregistrée. */
  before: ReactNode;
  /** Sens du changement : vert s'il monte, orange s'il baisse, rien sinon. */
  delta: number;
}

/**
 * Valeur en aperçu : colorée quand elle change, l'ancienne en infobulle.
 * Toujours le même élément : à la validation, la couleur d'aperçu s'efface
 * lentement vers l'encre, comme une encre qui sèche.
 */
const PreviewValue = ({ children, before, delta }: Props) => (
  <Tooltip title={delta ? <>Avant : {before}</> : ''} arrow enterTouchDelay={0}>
    <Box
      component="span"
      tabIndex={delta ? 0 : undefined}
      sx={{
        color: delta > 0 ? 'success.main' : delta < 0 ? 'warning.main' : null,
        // 600 sur la machine à écrire ; la main prend son 700.
        fontWeight: delta ? 600 : null,
        cursor: delta ? 'help' : null,
        // Vite vers l'aperçu ; lentement vers l'encre, à la validation.
        transition: delta
          ? `color ${MOTION.quick}ms ease-out`
          : `color ${MOTION.dry}ms ease-out`,
      }}
    >
      {children}
    </Box>
  </Tooltip>
);

export default PreviewValue;
