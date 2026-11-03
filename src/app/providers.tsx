'use client';

import { XpDialogProvider } from '@/components/organisms/xp-dialogs';
import DeleteIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { closeSnackbar, SnackbarProvider } from 'notistack';
import { PropsWithChildren } from 'react';

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  palette: {
    mode: 'dark',
  },
});

interface Props {
  /** Session lue par le serveur : le navigateur n'a pas à la redemander. */
  session: Session | null;
}

export default function Providers({
  session,
  children,
}: PropsWithChildren<Props>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme} defaultMode="dark">
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <SnackbarProvider
            autoHideDuration={2000}
            disableWindowBlurListener={true}
            maxSnack={5}
            preventDuplicate={true}
            action={(id) => (
              <Button onClick={() => closeSnackbar(id)}>
                <DeleteIcon />
              </Button>
            )}
          >
            <CssBaseline />
            <XpDialogProvider>{children}</XpDialogProvider>
          </SnackbarProvider>
        </SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
