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
      }}
      variant="outlined"
    >
      {active && children}
    </Paper>
  );
};

export default TabContent;
