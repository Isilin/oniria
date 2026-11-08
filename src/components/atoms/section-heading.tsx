import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ElementType, ReactNode } from 'react';
import { Armillary } from './ornaments';

/**
 * Le filet imprimé qui court après un titre ou une légende jusqu'au bord.
 * À poser sur un conteneur en `display: flex`.
 */
export const RUNNING_RULE = {
  '&::after': {
    content: '""',
    flex: 1,
    height: '1px',
    bgcolor: 'text.primary',
  },
} as const;

interface Props {
  children: ReactNode;
  /** Niveau du titre dans la page (h2 par défaut). */
  component?: ElementType;
  sx?: SxProps<Theme>;
}

/**
 * Un titre de section : frappé au tampon, précédé d'une sphère armillaire
 * et suivi d'un filet imprimé (sections de la feuille, listes de l'accueil).
 */
const SectionHeading = ({ children, component = 'h2', sx }: Props) => (
  <Typography
    variant="h4"
    component={component}
    sx={[
      { display: 'flex', alignItems: 'center', gap: 1.5, ...RUNNING_RULE },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <Armillary />
    {children}
  </Typography>
);

export default SectionHeading;
