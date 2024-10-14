'use client';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { SessionProvider } from 'next-auth/react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={darkTheme}>
        <SessionProvider>
          <CssBaseline />
          {children}
        </SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
