export const Colors = {
  // Primary palette — warm luxury
  cream: '#FAF8F5',
  silk: '#F0EBE3',
  beige: '#E8E0D5',
  tan: '#D4B896',
  gold: '#C9A96E',
  goldDark: '#A8833A',
  taupe: '#8C7B6B',

  // Neutral
  charcoal: '#1C1C1E',
  dark: '#2C2C2C',
  mid: '#5A5A5A',
  muted: '#9A9A9A',
  border: '#E0D8CE',
  white: '#FFFFFF',

  // Accent
  rose: '#D4A5A5',
  sage: '#A8B5A0',
  error: '#C0392B',
  success: '#27AE60',
  warning: '#E67E22',

  // Backgrounds
  bgPrimary: '#FAF8F5',
  bgSecondary: '#F0EBE3',
  bgCard: '#FFFFFF',
  bgOverlay: 'rgba(28,28,30,0.55)',
  bgOverlayLight: 'rgba(250,248,245,0.85)',
} as const;

export const Typography = {
  // Display — cinematic editorial
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 42,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 48,
    color: Colors.white,
  },
  displayXL: {
    fontFamily: 'serif',
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 42,
    color: Colors.charcoal,
  },
  displayLG: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 34,
    color: Colors.charcoal,
  },
  displayMD: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
    color: Colors.charcoal,
  },

  // Body
  bodyLG: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
    lineHeight: 24,
    color: Colors.dark,
  },
  bodyMD: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 21,
    color: Colors.dark,
  },
  bodySM: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 18,
    color: Colors.mid,
  },

  // Labels
  labelLG: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: Colors.charcoal,
  },
  labelMD: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.8,
    textTransform: 'uppercase' as const,
    color: Colors.taupe,
  },
  price: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: 0,
    color: Colors.charcoal,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 32,
  full: 999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  gold: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
