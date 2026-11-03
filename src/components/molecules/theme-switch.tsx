'use client';

import { usePreferences } from '@/lib/hooks/use-preferences';
import type { Density, ThemeMode } from '@/lib/preferences';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  IconButton,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

/**
 * Réglages d'affichage : thème et densité. Connecté, ils sont enregistrés
 * sur le compte ; sinon le thème reste propre à cet appareil.
 */
const ThemeSwitch = () => {
  const { mode, setMode } = useColorScheme();
  const { status } = useSession();
  const { preferences, save } = usePreferences();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const signedIn = status === 'authenticated';

  if (!mode) return null;

  const changeTheme = (value: ThemeMode | null) => {
    if (!value) return;
    setMode(value);
    if (signedIn) save({ theme: value });
  };

  const changeDensity = (value: Density | null) => {
    if (value) save({ density: value });
  };

  return (
    <>
      <Tooltip title="Affichage">
        <IconButton
          aria-label="Réglages d'affichage"
          aria-haspopup="dialog"
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          <TuneIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              display: 'grid',
              gap: 1.5,
              bgcolor: 'raised',
              border: 1,
              borderColor: 'rule',
            },
          },
        }}
      >
        <Box>
          <Typography variant="overline" component="p" color="textSecondary">
            Thème
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={mode}
            onChange={(e, value) => changeTheme(value)}
            aria-label="Thème"
          >
            <ToggleButton value="dark">Nuit</ToggleButton>
            <ToggleButton value="light">Jour</ToggleButton>
            <ToggleButton value="system">Système</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {signedIn && (
          <Box>
            <Typography variant="overline" component="p" color="textSecondary">
              Densité
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={preferences.density ?? 'comfortable'}
              onChange={(e, value) => changeDensity(value)}
              aria-label="Densité"
            >
              <ToggleButton value="comfortable">Confort</ToggleButton>
              <ToggleButton value="compact">Compact</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        <Typography variant="caption" color="textSecondary">
          {signedIn
            ? 'Enregistré sur ton compte.'
            : 'Enregistré sur cet appareil.'}
        </Typography>
      </Popover>
    </>
  );
};

export default ThemeSwitch;
