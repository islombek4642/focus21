/**
 * Obsidian Executive Design Tokens
 * Strictly adheres to DESIGN.md
 */

export const THEME = {
  colors: {
    canvas: '#0D0E11',
    card: '#16181D',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#E5A93C',
    accentPressed: '#C98E2A',
    success: '#10B981',
    successTint: 'rgba(16, 185, 129, 0.12)',
    textPrimary: '#FFFFFF',
    textSecondary: '#8F94A0',
    textTertiary: '#555A65',
    danger: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radii: {
    sm: 6,
    md: 10,
    lg: 14,
    full: 9999,
  },
  typography: {
    headingLg: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    headingMd: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      color: '#C5C8D0',
    },
    label: {
      fontSize: 11,
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 1.2,
      color: '#8F94A0',
    },
    timerDisplay: {
      fontSize: 38,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
  },
} as const;

export type ThemeType = typeof THEME;
