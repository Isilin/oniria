'use client';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { ReactNode } from 'react';

interface Props {
  /** Valeur avec les points en attente. */
  children: ReactNode;
  /** Valeur de la fiche enregistrée. */
  before: ReactNode;
  /** Sens du changement : vert s'il monte, orange s'il baisse, rien sinon. */
  delta: number;
}

/** Valeur en aperçu : colorée quand elle change, l'ancienne en infobulle. */
const PreviewValue = ({ children, before, delta }: Props) => {
  if (!delta) return <>{children}</>;
  return (
    <Tooltip title={<>Avant : {before}</>} arrow enterTouchDelay={0}>
      <Box
        component="span"
        tabIndex={0}
        sx={{
          color: delta > 0 ? 'success.main' : 'warning.main',
          fontWeight: 'bold',
          cursor: 'help',
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

export default PreviewValue;
