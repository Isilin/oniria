'use client';

import LockIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpenOutlined';
import Tooltip from '@mui/material/Tooltip';

/** Indique si une partie de la fiche est validée ou se modifie librement. */
const ScopeLock = ({ locked }: { locked: boolean }) => (
  <Tooltip
    arrow
    title={
      locked
        ? 'Validé : chaque amélioration est un achat ; seul le MJ peut baisser ou retirer.'
        : 'Se modifie librement : le coût sera payé à la validation.'
    }
  >
    {locked ? (
      <LockIcon
        fontSize="inherit"
        color="disabled"
        sx={{ verticalAlign: 'middle', ml: 0.5 }}
        aria-label="Validé"
      />
    ) : (
      <LockOpenIcon
        fontSize="inherit"
        color="warning"
        sx={{ verticalAlign: 'middle', ml: 0.5 }}
        aria-label="Modifiable librement"
      />
    )}
  </Tooltip>
);

export default ScopeLock;
