'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';

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
          <CssBaseline />
          {children}
        </SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
