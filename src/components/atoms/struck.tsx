'use client';

import RestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import {
  Box,
  ButtonBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';

const ERROR = 'var(--mui-palette-error-main)';

/**
 * Ce qui a été rayé par le MJ : un trait d'encre rouge sur la valeur, qui
 * pâlit. Le trait passe sur tout le texte de l'élément (nom, détail, valeurs
 * écrites à la main).
 */
export const Struck = ({
  struck = true,
  children,
}: {
  struck?: boolean;
  children: ReactNode;
}) =>
  struck ? (
    <Box
      component="span"
      sx={{
        color: 'text.secondary',
        textDecorationLine: 'line-through',
        textDecorationColor: ERROR,
        textDecorationThickness: '2px',
        // L'encre bleue d'une valeur écrite pâlit aussi sous le trait.
        '& .MuiTypography-root': { color: 'inherit' },
      }}
    >
      {children}
    </Box>
  ) : (
    children
  );

/** « 6 novembre 2026 » : la date à laquelle l'élément a été rayé. */
const lostDate = (lostAt: Date | string) =>
  new Date(lostAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/**
 * Sous un élément rayé : l'XP qu'il a fait perdre, en rouge, et la date en
 * infobulle. Le trait suffit à dire qu'il est rayé : rien quand aucune XP
 * n'a été perdue.
 */
export const LostNote = ({
  lostAt,
  lostXp,
}: {
  lostAt: Date | string;
  lostXp?: number | null;
}) =>
  lostXp ? (
    <Tooltip title={`Rayé par le MJ le ${lostDate(lostAt)}`} describeChild>
      <Typography
        variant="caption"
        color="error"
        tabIndex={0}
        sx={{ display: 'block', cursor: 'help', lineHeight: 1.3 }}
      >
        {lostXp}&nbsp;XP perdus
      </Typography>
    </Tooltip>
  ) : null;

/**
 * Les points d'une caractéristique rayés par le MJ : leur nombre, barré en
 * rouge, devant la valeur. La rature reste quand des points sont rachetés ;
 * le MJ l'efface en rétablissant les points (menu au clic).
 */
export const LostPoints = ({
  points,
  label,
  onRestore,
}: {
  points: number;
  /** La caractéristique (« Force »), pour les lecteurs d'écran. */
  label: string;
  onRestore?: () => void;
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const plural = points > 1 ? 's' : '';
  const text = `${label} : ${points} point${plural} rayé${plural} par le MJ (perdu${plural}).`;
  const mark = (
    <Typography
      variant="numeral"
      component="span"
      sx={{
        color: 'error.main',
        fontSize: '0.875rem',
        textDecorationLine: 'line-through',
        textDecorationThickness: '2px',
      }}
    >
      {points}
    </Typography>
  );

  if (!onRestore) {
    return (
      <Tooltip title={text} describeChild>
        <Box component="span" tabIndex={0} sx={{ cursor: 'help' }}>
          {mark}
        </Box>
      </Tooltip>
    );
  }
  return (
    <>
      <Tooltip title={`${text} Le MJ peut les rétablir.`} describeChild>
        <ButtonBase
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ borderRadius: 0.5, px: 0.25 }}
        >
          {mark}
        </ButtonBase>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onRestore();
          }}
        >
          <ListItemIcon>
            <RestoreIcon fontSize="small" />
          </ListItemIcon>
          Rétablir {points} point{plural}
        </MenuItem>
      </Menu>
    </>
  );
};
