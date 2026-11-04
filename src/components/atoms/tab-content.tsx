import { EASE, MOTION } from '@/theme/theme';
import Paper from '@mui/material/Paper';
import { PropsWithChildren } from 'react';

interface Props {
  index: number;
  active: boolean;
}

/**
 * Seul l'onglet ouvert est rendu : une modification ne redessine que lui, et
 * l'éditeur des Notes n'est chargé qu'à l'ouverture de son onglet.
 */
const TabContent = ({ index, active, children }: PropsWithChildren<Props>) => {
  return (
    <Paper
      role="tabpanel"
      id={`tabpanel${index}`}
      aria-labelledby={`tab${index}`}
      hidden={!active}
      sx={{
        display: active ? 'flex' : 'none',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 1,
        border: 'none',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'stretch',
        // Le contenu se pose sur le fond, comme les colonnes d'une page.
        bgcolor: 'transparent',
        // L'onglet ouvert se pose sur la feuille ; l'animation repart à chaque
        // ouverture (display: none → flex). Fondu seul en mouvement réduit.
        animation: `oniria-panel ${MOTION.state}ms ${EASE} both`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: `oniria-fade ${MOTION.state}ms ease-out both`,
        },
      }}
      variant="outlined"
    >
      {active && children}
    </Paper>
  );
};

export default TabContent;
