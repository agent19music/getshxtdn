/**
 * Mavuno Design System — StyleSheet-compatible tokens.
 * Source of truth: DESIGN.md. No deviation.
 */

import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Colors (DESIGN.md §2, §14)
// ---------------------------------------------------------------------------

export const Colors = {
  light: {
    // Surfaces (layered off-white — §14.1)
    background: '#F5F5F5',        // L0 — marketing / auth only
    surface: '#FAFAFA',           // L1 — app-shell plane
    card: '#FCFCFC',              // Card on L1 — lifts above, pair with shadow.xs
    insetSurface: '#F0F0F0',      // Wells inside cards
    hoverSurface: '#F0F0F0',      // Hover wash on L1
    popover: '#FAFAFA',           // L2 — pair with shadow.md

    // Borders
    border: 'rgba(0,0,0,0.08)',   // Hairline
    borderStrong: '#E8E8E8',      // Explicit dividers

    // Foreground
    foreground: '#171717',
    foregroundMuted: '#52525B',
    foregroundSubtle: '#A1A1AA',

    // Buttons
    primaryBg: '#171717',
    primaryText: '#FAFAFA',
    primaryHoverBg: '#383838',
    secondaryBorder: 'rgba(0,0,0,0.08)',
    secondaryHoverBg: 'rgba(0,0,0,0.04)',

    // Brand accents (use sparingly)
    accent: '#41431B',
    brandCream: '#F8F3E1',
    brandOlive: '#41431B',
    brandSand: '#E3DBBB',
    brandMoss: '#AEB784',

    // Semantic
    success: '#00C853',
    warning: '#F5A623',
    danger: '#E5484D',
  },
  dark: {
    // Surfaces (layered charcoal — §14.1)
    background: '#1A1A1A',        // L0
    surface: '#2D2D2D',           // L1
    card: '#2A2A2A',              // Card on L1 — settles beneath, pair with shadow.xs
    insetSurface: '#252525',      // Inset wells — soft recess
    hoverSurface: '#3A3A3A',      // L2 hover wash
    popover: '#3A3A3A',           // L2

    // Borders
    border: 'rgba(255,255,255,0.08)',
    borderStrong: '#4A4A4A',

    // Foreground
    foreground: '#EDEDED',
    foregroundMuted: '#CDCDD4',
    foregroundSubtle: '#8E8E96',

    // Buttons (inverted in dark — §5.2, §14)
    primaryBg: '#EDEDED',
    primaryText: '#1A1A1A',
    primaryHoverBg: '#CCCCCC',
    secondaryBorder: 'rgba(255,255,255,0.145)',
    secondaryHoverBg: '#1A1A1A',

    // Brand accents
    accent: '#41431B',
    brandCream: '#F8F3E1',
    brandOlive: '#41431B',
    brandSand: '#E3DBBB',
    brandMoss: '#AEB784',

    // Semantic
    success: '#00C853',
    warning: '#F5A623',
    danger: '#E5484D',
  },
} as const;

// Use a mapped type that collapses literal string unions per key
export type ThemeColors = {
  [K in keyof typeof Colors.light]: (typeof Colors.light)[K] | (typeof Colors.dark)[K];
};
export type ThemeColorKey = keyof ThemeColors;
export type ColorMode = 'light' | 'dark';

// ---------------------------------------------------------------------------
// Spacing — 8px grid (DESIGN.md §3)
// ---------------------------------------------------------------------------

export const Spacing = {
  xs: 4,       // space-1
  sm: 8,       // space-2
  md: 12,      // space-3
  base: 16,    // space-4
  lg: 24,      // space-6
  xl: 32,      // space-8
  '2xl': 48,   // space-12
  '3xl': 64,   // space-16
  '4xl': 96,   // space-24
  '5xl': 128,  // space-32
} as const;

// ---------------------------------------------------------------------------
// Radius (DESIGN.md §7 — cards 8-12px, never above 16, pills 9999)
// ---------------------------------------------------------------------------

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 9999,
} as const;

// ---------------------------------------------------------------------------
// Typography (DESIGN.md §1)
// RN requires absolute lineHeight, so we compute fontSize * ratio.
// ---------------------------------------------------------------------------

export const Typography = {
  display: {
    fontSize: 48,
    fontWeight: '600' as const,
    lineHeight: 53,       // 48 * 1.1
    letterSpacing: -0.96, // -0.02em * 48
  },
  h1: {
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 38,       // 32 * 1.2
    letterSpacing: -0.48, // -0.015em * 32
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 31,       // 24 * 1.3
    letterSpacing: -0.24, // -0.01em * 24
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,       // 20 * 1.4
    letterSpacing: -0.1,  // -0.005em * 20
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 29,       // 18 * 1.6
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 26,       // 16 * 1.6
    letterSpacing: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,       // 14 * 1.4
    letterSpacing: 0,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,       // 13 * 1.4
    letterSpacing: 0,
  },
} as const;

// ---------------------------------------------------------------------------
// Shadows (DESIGN.md §8)
// Light and dark pairs — same offsets, different opacity.
// ---------------------------------------------------------------------------

export type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ShadowSet = {
  none: ShadowStyle;
  xs: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
};

export function getShadows(mode: ColorMode): ShadowSet {
  const isLight = mode === 'light';
  return {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isLight ? 0.04 : 0.4,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isLight ? 0.04 : 0.6,
      shadowRadius: 24,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: isLight ? 0.08 : 0.6,
      shadowRadius: 48,
      elevation: 8,
    },
  };
}

// ---------------------------------------------------------------------------
// Button tokens (DESIGN.md §5)
// ---------------------------------------------------------------------------

export const ButtonTokens = {
  height: 48,
  paddingHorizontal: 20,
  borderRadius: Radius.pill,
  fontSize: 16,
  fontWeight: '500' as const,
  iconSize: 16,
  iconGap: 8,
} as const;

// ---------------------------------------------------------------------------
// Font family names — loaded via @expo-google-fonts/manrope
// ---------------------------------------------------------------------------

export const Fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  mono: Platform.select({
    ios: 'SF Mono',
    default: 'monospace',
  }),
} as const;

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

export const Layout = {
  maxContentWidth: 768,
  navHeight: 64,
  tabBarHeight: Platform.select({ ios: 80, default: 64 }) as number,
  inputHeight: 48,
  touchTarget: 44, // minimum touch target (§13)
} as const;
