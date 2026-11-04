'use client';

import { usePreferences } from '@/lib/hooks/use-preferences';
import type { SectionKey } from '@/lib/preferences';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { PropsWithChildren, ReactNode, useId } from 'react';
import { Armillary } from '../atoms/ornaments';

interface Props {
  title: ReactNode;
  /** Ce qui s'aligne à droite du titre (verrou, statut, action). */
  adornment?: ReactNode;
  /** Section repliable : l'état est enregistré sur le compte. */
  section?: SectionKey;
}

/**
 * Une section de la feuille : un titre frappé au tampon, précédé d'une
 * sphère armillaire et suivi d'un filet imprimé, puis son contenu.
 * Repliable quand `section` est donné.
 */
const SectionCard = ({
  title,
  adornment,
  section,
  children,
}: PropsWithChildren<Props>) => {
  const { isCollapsed, toggleSection } = usePreferences();
  const contentId = useId();
  const collapsed = section ? isCollapsed(section) : false;

  return (
    <Box component="section" sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: collapsed ? 0 : 1,
          minHeight: 32,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            '&::after': {
              content: '""',
              flex: 1,
              height: '1px',
              bgcolor: 'text.primary',
            },
          }}
        >
          <Armillary />
          {title}
        </Typography>
        {adornment}
        {section && (
          <IconButton
            size="small"
            aria-expanded={!collapsed}
            aria-controls={contentId}
            aria-label={`${collapsed ? 'Déplier' : 'Replier'}${
              typeof title === 'string' ? ` : ${title}` : ''
            }`}
            onClick={() => toggleSection(section)}
            sx={{
              transform: collapsed ? 'rotate(-90deg)' : 'none',
              transition: 'transform 160ms ease-out',
            }}
          >
            <ExpandIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Collapse in={!collapsed} id={contentId} timeout={180}>
        {children}
      </Collapse>
    </Box>
  );
};

export default SectionCard;
