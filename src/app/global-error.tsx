'use client';

import SvgDefs from '@/components/atoms/svg-defs';
import ErrorNotice from '@/components/organisms/error-notice';
import { FONT_VARIABLES } from '@/theme/fonts';
import { createOniriaTheme } from '@/theme/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import './globals.css';
import styles from './page.module.css';

const theme = createOniriaTheme();

/**
 * Le layout lui-même n'a pas pu s'afficher : le plus souvent, la base ne
 * répond pas (la session y est lue à chaque page). Cette page remplace tout
 * le document, et pose donc elle-même la feuille, ses polices et son thème,
 * sans rien qui dépende du serveur.
 */
const GlobalError = ({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && 'digest' in error
      ? String(error.digest)
      : undefined;

  return (
    <html lang="fr" className={FONT_VARIABLES} suppressHydrationWarning>
      <body>
        <title>Lunes d&apos;Oniria</title>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme} defaultMode="dark">
            <CssBaseline />
            <SvgDefs />
            <div className={styles.page}>
              <div className={styles.leaf}>
                <main className={styles.main} style={{ paddingTop: 48 }}>
                  <Typography variant="h1" sx={{ textAlign: 'center' }}>
                    ONIRIA
                  </Typography>
                  <ErrorNotice
                    title="Le carnet n'a pas pu s'ouvrir"
                    headingLevel="h2"
                    onRetry={retry}
                    digest={digest}
                  >
                    Le serveur ne répond pas pour l&apos;instant. Réessaie dans
                    un instant{'\u00a0'}; si ça recommence, préviens le MJ.
                  </ErrorNotice>
                </main>
              </div>
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default GlobalError;
