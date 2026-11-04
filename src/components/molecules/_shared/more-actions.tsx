'use client';

import MoreIcon from '@mui/icons-material/MoreVert';
import {
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
}

/**
 * Actions rares ou destructrices, rangées hors de la ligne de navigation
 * pour qu'un clic sur « retour » ne tombe jamais dessus.
 */
const MoreActions = ({ label, actions }: Props) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title={label}>
        <IconButton
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          <MoreIcon />
        </IconButton>
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
