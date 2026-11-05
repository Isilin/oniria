import { EASE, MOTION } from '@/theme/theme';
import Paper from '@mui/material/Paper';
import { PropsWithChildren } from 'react';

interface Props {
  index: number;
  active: boolean;
  /**
   * Sens de la page qui tourne : 1 vers un onglet à droite, −1 vers un
   * onglet à gauche, 0 à l'ouverture de la fiche.
   */
  direction?: -1 | 0 | 1;
}

const PAGE = {
  '-1': 'oniria-page-prev',
  '0': 'oniria-panel',
  '1': 'oniria-page-next',
};

/**
 * Seul l'onglet ouvert est rendu : une modification ne redessine que lui, et
 * l'éditeur des Notes n'est chargé qu'à l'ouverture de son onglet.
 */
const TabContent = ({
  index,
  active,
  direction = 0,
  children,
}: PropsWithChildren<Props>) => {
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
        // L'onglet ouvert arrive comme une page qui tourne, du côté de
        // l'onglet choisi ; l'animation repart à chaque ouverture
        // (display: none → flex). Fondu seul en mouvement réduit.
        animation: `${PAGE[direction]} ${MOTION.state}ms ${EASE} both`,
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
