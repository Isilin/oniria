'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { PropsWithChildren, useTransition } from 'react';
import BusyButton from '../atoms/busy-button';
import { Constellation } from '../atoms/ornaments';

interface Props {
  title: string;
  /** Titre principal de la page (h1) ou, sous ONIRIA, un titre de second rang. */
  headingLevel?: 'h1' | 'h2';
  /** Relance l'affichage de la page ; sans elle, seul le retour à l'accueil. */
  onRetry?: () => void;
  /**
   * Une erreur qui vient d'arriver, annoncée aux lecteurs d'écran. Une page
   * introuvable est une page comme une autre : son titre suffit.
   */
  alert?: boolean;
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
  alert = false,
  digest,
  children,
}: PropsWithChildren<Props>) => {
  // Le serveur reprépare la page : « Réessayer » reste occupé jusque-là.
  const [retrying, startRetry] = useTransition();

  return (
    <Box
      role={alert ? 'alert' : undefined}
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
          <BusyButton
            variant="contained"
            busy={retrying}
            onClick={() => startRetry(onRetry)}
          >
            Réessayer
          </BusyButton>
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
};

export default ErrorNotice;
