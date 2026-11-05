export type ColorMode = 'light' | 'dark';

/**
 * Glow framework tokens.
 * Light values come straight from the design canvas Foundations board.
 * Dark values are derived (the design ships light only) and keep text at 4.5:1 or better.
 */
export interface GlowTokens {
  /** Page canvas */
  ground: string;
  /** Cards, chips, inputs on the canvas */
  surface: string;
  /** Product tiles, ring tracks, inputs inside white cards */
  petal: string;
  /** Idle dots, strong dividers, switch tracks */
  mauve: string;
  /** Primary text */
  text: string;
  /** Secondary text */
  textSecondary: string;
  /** Primary action (pill buttons, active nav, selected chips) */
  action: string;
  actionText: string;
  /** Accent words, ring fills, small highlights */
  accent: string;
  /** Accent used on inverse surfaces */
  bloom: string;
  /** Oud gold, decorative only */
  gold: string;
  divider: string;
  /** Inverse surface (consultation band, footer, default address card) */
  inverse: string;
  inverseText: string;
  inverseMuted: string;
  /** Floating nav / header glass */
  glass: string;
  /** Info panel laid over photography */
  scrim: string;
  shadow: string;
  shadowStrong: string;
}

export const GLOW_TOKENS: Record<ColorMode, GlowTokens> = {
  light: {
    ground: '#F6EAF3',
    surface: '#FFFFFF',
    petal: '#EFDCEB',
    mauve: '#D9BDD2',
    text: '#150C14',
    textSecondary: '#5F4B5C',
    action: '#150C14',
    actionText: '#FFFFFF',
    accent: '#9C3F71',
    bloom: '#E7B3D2',
    gold: '#C9A46A',
    divider: '#F3E6EF',
    inverse: '#150C14',
    inverseText: '#FFFFFF',
    inverseMuted: 'rgba(255, 255, 255, 0.78)',
    glass: 'rgba(255, 255, 255, 0.94)',
    scrim: 'rgba(255, 255, 255, 0.92)',
    shadow: '0 10px 30px rgba(92, 40, 80, 0.08)',
    shadowStrong: '0 16px 40px rgba(92, 40, 80, 0.18)',
  },
  dark: {
    ground: '#150C14',
    surface: '#1F1420',
    petal: '#2A1B28',
    mauve: '#4A3447',
    text: '#F6EAF3',
    textSecondary: '#C9B6C5',
    action: '#F6EAF3',
    actionText: '#150C14',
    accent: '#E7B3D2',
    bloom: '#E7B3D2',
    gold: '#C9A46A',
    divider: '#33223A',
    inverse: '#2E1D2B',
    inverseText: '#F6EAF3',
    inverseMuted: 'rgba(246, 234, 243, 0.78)',
    glass: 'rgba(31, 20, 32, 0.94)',
    scrim: 'rgba(31, 20, 32, 0.9)',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
    shadowStrong: '0 16px 40px rgba(0, 0, 0, 0.5)',
  },
};

export const GLOW_RADII = {
  pill: 999,
  card: 28,
  tile: 32,
  hero: 40,
  input: 18,
} as const;

export const MOTION_CURVES = {
  editorialEase: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
  modeCrossfade:
    'background-color 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), color 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), border-color 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)',
};
