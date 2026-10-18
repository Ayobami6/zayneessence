export type ColorMode = 'light' | 'dark';

export interface ZayneCustomTokens {
  productTile: string;
  tileInnerArch: string;
  primaryButtonBg: string;
  primaryButtonText: string;
  headerGlass: string;
  archRadius: string;
  innerArchRadius: string;
  pillRadius: number;
  tileRadius: number;
  modeTransition: string;
}

export const PLUM_TOKENS: Record<
  ColorMode,
  {
    background: string;
    paper: string;
    textPrimary: string;
    textSecondary: string;
    divider: string;
    productTile: string;
    tileInnerArch: string;
    primaryBg: string;
    primaryText: string;
    headerGlass: string;
  }
> = {
  light: {
    background: '#F6F3F7',
    paper: '#FBF9FC',
    textPrimary: '#1E1022',
    textSecondary: '#6E5677',
    divider: '#E2D9E5',
    productTile: '#ECE4EF',
    tileInnerArch: '#E1D5E5',
    primaryBg: '#3A2440',
    primaryText: '#F6F3F7',
    headerGlass: 'rgba(246, 243, 247, 0.86)',
  },
  dark: {
    background: '#170C1B',
    paper: '#1E1123',
    textPrimary: '#F1EAF3',
    textSecondary: '#B4A3BA',
    divider: '#33213A',
    productTile: '#241528',
    tileInnerArch: '#2E1C33',
    primaryBg: '#EAE1EC',
    primaryText: '#1E1022',
    headerGlass: 'rgba(23, 12, 27, 0.86)',
  },
};

export const MOTION_CURVES = {
  editorialEase: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
  modeCrossfade:
    'background-color 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), color 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), border-color 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)',
};
