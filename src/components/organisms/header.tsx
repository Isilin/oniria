'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import ThemeSwitch from '../molecules/theme-switch';

/**
 * Barre fine en haut de chaque page : retour (posé par la page), le nom du
 * jeu, l'affichage et les actions de la page (⋯). Voir HeaderSlot.
 */
const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        maxWidth: 1400,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minHeight: 52,
        borderBottom: 1,
        borderColor: 'rule',
      }}
    >
      <Box id="header-start" sx={{ display: 'flex', alignItems: 'center' }} />
      <Typography
        component={Link}
        href="/"
        variant="overline"
        sx={{
          color: 'text.secondary',
          textDecoration: 'none',
          letterSpacing: '0.24em',
          '&:hover': { color: 'text.primary' },
        }}
      >
        Oniria
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <ThemeSwitch />
      <Box id="header-end" sx={{ display: 'flex', alignItems: 'center' }} />
    </Box>
  );
};

export default Header;
