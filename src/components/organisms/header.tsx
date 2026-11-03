'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import ThemeSwitch from '../molecules/theme-switch';

/** Barre fine en haut de chaque page : le nom du jeu et l'affichage. */
const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        maxWidth: 1400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 52,
        borderBottom: 1,
        borderColor: 'rule',
      }}
    >
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
      <ThemeSwitch />
    </Box>
  );
};

export default Header;
