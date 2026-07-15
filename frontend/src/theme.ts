import { Platform } from 'react-native';

export const colors = {
  surface: '#161311',
  onSurface: '#F0E6D2',
  surfaceSecondary: '#2C221C',
  onSurfaceSecondary: '#E8D5B7',
  surfaceTertiary: '#4A3B32',
  onSurfaceTertiary: '#F0E6D2',
  surfaceInverse: '#E3CBA8',
  onSurfaceInverse: '#2A1E17',
  brandPrimary: '#C69C4A',
  onBrandPrimary: '#1A120E',
  brandSecondary: '#A37D35',
  brandTertiary: '#805A21',
  success: '#4C6B4C',
  warning: '#B8860B',
  error: '#7A3B3B',
  border: '#3D2E25',
  borderStrong: '#A37D35',
  divider: '#3D2E25',
  backdrop: 'rgba(10,7,5,0.85)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
};

// System serif fonts evoke the pirate / parchment feel without loading web fonts.
export const fonts = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) as string,
  text: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
};

export const type = {
  h1: { fontFamily: fonts.display, fontSize: 32, fontWeight: '700' as const, letterSpacing: 1.5, color: colors.onSurface },
  h2: { fontFamily: fonts.display, fontSize: 24, fontWeight: '700' as const, letterSpacing: 1, color: colors.onSurface },
  h3: { fontFamily: fonts.display, fontSize: 20, fontWeight: '700' as const, color: colors.onSurface },
  body: { fontFamily: fonts.text, fontSize: 15, lineHeight: 22, color: colors.onSurface },
  small: { fontFamily: fonts.text, fontSize: 12, color: colors.onSurfaceSecondary },
  label: { fontFamily: fonts.text, fontSize: 11, letterSpacing: 2, fontWeight: '700' as const, color: colors.brandPrimary },
};

export const images = {
  homeHero: 'https://images.pexels.com/photos/14436275/pexels-photo-14436275.jpeg',
  wood: 'https://images.pexels.com/photos/6485474/pexels-photo-6485474.jpeg',
  parchment: 'https://images.unsplash.com/photo-1719563015025-83946fb49e49',
};
