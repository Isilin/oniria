'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fleuron, MoonPhases } from '../atoms/ornaments';
import ThemeSwitch from '../molecules/theme-switch';

/**
 * Le bandeau-titre imprimé en haut de la feuille : retour (posé par la
 * page), le titre de la page et ONIRIA entre deux fleurons et les phases de
 * la lune, puis l'affichage et les actions de la page (⋯). Voir HeaderSlot.
 */
const Header = () => {
  // L'accueil porte déjà ONIRIA en grand : le bandeau n'en garde que la frise.
  const home = usePathname() === '/';
  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
        alignItems: 'center',
        columnGap: 1,
        minHeight: 52,
        // Sous le cadre imprimé de la feuille.
        pt: { xs: 1.5, sm: 2.5 },
      }}
    >
      <Box
        id="header-start"
        sx={{ display: 'flex', alignItems: 'center', justifySelf: 'start' }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          justifySelf: 'center',
          minWidth: 0,
        }}
      >
        <Fleuron sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Typography
          id="header-title"
          component="span"
          variant="h4"
          sx={{
            display: { xs: 'none', md: 'flex' },
            '&:empty': { display: 'none' },
            whiteSpace: 'nowrap',
          }}
        />
        <MoonPhases
          sx={{ display: home ? 'block' : { xs: 'none', lg: 'block' } }}
        />
        <Typography
          component={Link}
          href="/"
          variant="h4"
          sx={{
            display: home ? 'none' : 'block',
            color: 'text.primary',
            textDecoration: 'none',
            letterSpacing: '0.32em',
            whiteSpace: 'nowrap',
            '&:hover': { color: 'primary.main' },
          }}
        >
          Oniria
        </Typography>
        <Fleuron sx={{ display: { xs: 'none', sm: 'block' } }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifySelf: 'end',
        }}
      >
        <ThemeSwitch />
        <Box id="header-end" sx={{ display: 'flex', alignItems: 'center' }} />
      </Box>
    </Box>
  );
};

export default Header;
