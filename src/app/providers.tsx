'use client';

import { XpDialogProvider } from '@/components/organisms/xp-dialogs';
import { usePreferences } from '@/lib/hooks/use-preferences';
import type { Density } from '@/lib/preferences';
import { createOniriaTheme } from '@/theme/theme';
import DeleteIcon from '@mui/icons-material/Close';
import { Fade, IconButton } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useColorScheme } from '@mui/material/styles';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { closeSnackbar, SnackbarProvider } from 'notistack';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

interface Props {
  /** Session lue par le serveur : le navigateur n'a pas à la redemander. */
  session: Session | null;
}

/**
 * Applique les réglages du compte (thème, densité) dès qu'ils arrivent :
 * ils suivent le joueur d'un appareil à l'autre.
 */
const PreferencesSync = ({
  onDensity,
}: {
  onDensity: (density: Density) => void;
}) => {
  const { preferences, loaded } = usePreferences();
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    if (loaded && preferences.theme && preferences.theme !== mode) {
      setMode(preferences.theme);
    }
    // Seulement à l'arrivée des réglages : un choix fait ensuite sur cet
    // appareil l'emporte jusqu'à son enregistrement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, preferences.theme]);

  useEffect(() => {
    onDensity(preferences.density ?? 'comfortable');
  }, [preferences.density, onDensity]);

  return null;
};

export default function Providers({
  session,
  children,
}: PropsWithChildren<Props>) {
  const [density, setDensity] = useState<Density>('comfortable');
  const theme = useMemo(() => createOniriaTheme(density), [density]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme} defaultMode="dark">
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <SnackbarProvider
            autoHideDuration={2000}
            disableWindowBlurListener={true}
            maxSnack={5}
            preventDuplicate={true}
            // Le billet glisse de lui-même (thème, oniria-billet) : la boîte
            // ne fait que paraître et s'en va vite.
            TransitionComponent={Fade}
            transitionDuration={{ enter: 280, exit: 160 }}
            action={(id) => (
              <IconButton
                aria-label="Fermer"
                color="inherit"
                size="small"
                onClick={() => closeSnackbar(id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          >
            <CssBaseline />
            <PreferencesSync onDensity={setDensity} />
            <XpDialogProvider>{children}</XpDialogProvider>
          </SnackbarProvider>
        </SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
