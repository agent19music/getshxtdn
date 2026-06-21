import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import type { ColorMode } from '@/constants/theme';

type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  /** The resolved mode after applying user preference over system scheme. */
  mode: ColorMode;
  /** The user's current preference ('system' | 'light' | 'dark'). */
  preference: ThemePreference;
  /** Set the user's preference. */
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const mode: ColorMode = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const value = useMemo(
    () => ({ mode, preference, setPreference }),
    [mode, preference],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePreference(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used inside <ThemeProvider>');
  }
  return ctx;
}
