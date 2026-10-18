'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createZayneTheme } from './theme';
import { ColorMode } from './tokens';

const COLOR_MODE_STORAGE_KEY = 'zayneessence_color_mode';

interface ColorModeContextValue {
  mode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleColorMode: () => {},
  setColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY) as ColorMode | null;
    if (saved === 'light' || saved === 'dark') {
      setMode(saved);
      document.documentElement.setAttribute('data-color-mode', saved);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const initialMode: ColorMode = mediaQuery.matches ? 'dark' : 'light';
    setMode(initialMode);
    document.documentElement.setAttribute('data-color-mode', initialMode);

    const handleChange = (event: MediaQueryListEvent) => {
      const currentSaved = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
      if (!currentSaved) {
        const nextMode: ColorMode = event.matches ? 'dark' : 'light';
        setMode(nextMode);
        document.documentElement.setAttribute('data-color-mode', nextMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setColorMode = (nextMode: ColorMode) => {
    setMode(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, nextMode);
      document.documentElement.setAttribute('data-color-mode', nextMode);
    }
  };

  const toggleColorMode = () => {
    setColorMode(mode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(() => createZayneTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setColorMode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode]
  );

  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ColorModeContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
