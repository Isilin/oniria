'use client';

import MoreIcon from '@mui/icons-material/MoreVert';
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { ReactNode, useState } from 'react';

export interface MoreAction {
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick: () => void;
}

interface Props {
  /** Nom accessible du bouton (« Actions sur la fiche »). */
  label: string;
  actions: MoreAction[];
  /**
   * Une action lancée depuis le menu attend le serveur (export) : le bouton
   * montre la petite roue et ne rouvre pas le menu.
   */
  busy?: boolean;
}

/**
 * Actions rares ou destructrices, rangées hors de la ligne de navigation
 * pour qu'un clic sur « retour » ne tombe jamais dessus.
 */
const MoreActions = ({ label, actions, busy = false }: Props) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title={label}>
        {/* Un bouton désactivé ne reçoit pas le survol : l'infobulle se
            pose sur son enveloppe. */}
        <span>
          <IconButton
            aria-label={label}
            aria-haspopup="menu"
            aria-expanded={Boolean(anchor)}
            aria-busy={busy || undefined}
            disabled={busy}
            onClick={(e) => setAnchor(e.currentTarget)}
            // Occupé n'est pas indisponible : l'icône garde son encre.
            sx={busy ? { '&.Mui-disabled': { color: 'inherit' } } : undefined}
          >
            {busy ? (
              <CircularProgress
                aria-hidden
                size={18}
                thickness={5}
                color="inherit"
                disableShrink
              />
            ) : (
              <MoreIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => {
              setAnchor(null);
              action.onClick();
            }}
            sx={action.danger ? { color: 'error.main' } : undefined}
          >
            {action.icon && (
              <ListItemIcon sx={{ color: 'inherit' }}>
                {action.icon}
              </ListItemIcon>
            )}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreActions;
