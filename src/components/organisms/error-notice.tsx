'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { Constellation } from '../atoms/ornaments';

interface Props {
  title: string;
  /** Titre principal de la page (h1) ou, sous ONIRIA, un titre de second rang. */
  headingLevel?: 'h1' | 'h2';
  /** Relance l'affichage de la page ; sans elle, seul le retour à l'accueil. */
  onRetry?: () => void;
  /**
   * Identifiant de l'erreur dans les journaux du serveur : à donner au MJ si
   * le problème revient.
   */
  digest?: string;
}

/**
 * Une page qui n'a pas pu s'afficher (introuvable, erreur du serveur), écrite
 * sur la feuille comme le reste : titre frappé au tampon, explication tapée,
 * et l'action qui en sort.
 */
const ErrorNotice = ({
  title,
  headingLevel = 'h1',
  onRetry,
  digest,
  children,
}: PropsWithChildren<Props>) => (
  <Box
    role="alert"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      maxWidth: '46ch',
      py: { xs: 2, md: 6 },
      textAlign: 'center',
    }}
  >
    {/* Une constellation pâle dans le blanc de la page. */}
    <Constellation sx={{ width: 200, height: 'auto', mb: 1 }} />
    <Typography variant="h3" component={headingLevel}>
      {title}
    </Typography>
    <Typography color="textSecondary" sx={{ textWrap: 'pretty' }}>
      {children}
    </Typography>
    {digest && (
      <Typography variant="caption" color="textSecondary">
        Référence{'\u00a0'}: {digest}
      </Typography>
    )}
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1,
        mt: 1,
      }}
    >
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Réessayer
        </Button>
      )}
      <Button
        component={Link}
        href="/"
        variant={onRetry ? 'text' : 'contained'}
      >
        Retour à l&apos;accueil
      </Button>
    </Box>
  </Box>
);

export default ErrorNotice;
