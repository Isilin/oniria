'use client';

import DeleteIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { closeSnackbar, SnackbarProvider } from 'notistack';

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  palette: {
    mode: 'dark',
  },
});

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme} defaultMode="dark">
        <SessionProvider>
          <SnackbarProvider
            autoHideDuration={2000}
            disableWindowBlurListener={true}
            maxSnack={5}
            action={(id) => (
              <Button onClick={() => closeSnackbar(id)}>
                <DeleteIcon />
              </Button>
            )}
          >
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
