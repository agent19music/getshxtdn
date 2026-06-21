import { Colors, getShadows, type ColorMode, type ThemeColors, type ShadowSet } from '@/constants/theme';
import { useThemePreference } from '@/contexts/ThemeContext';

export interface Theme {
  colors: ThemeColors;
  shadows: ShadowSet;
  mode: ColorMode;
}

export function useTheme(): Theme {
  const { mode } = useThemePreference();

  return {
    colors: Colors[mode],
    shadows: getShadows(mode),
    mode,
  };
}
