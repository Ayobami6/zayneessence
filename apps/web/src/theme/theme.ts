import type React from 'react';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ColorMode, GLOW_RADII, GLOW_TOKENS, GlowTokens, MOTION_CURVES } from './tokens';

/** Legacy token names still read by the studio admin screen. */
export interface ZayneCompatTokens {
  productTile: string;
  tileRadius: number;
  modeTransition: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    glow: GlowTokens & { radii: typeof GLOW_RADII };
    zayne: ZayneCompatTokens;
  }
  interface PaletteOptions {
    glow?: GlowTokens & { radii: typeof GLOW_RADII };
    zayne?: ZayneCompatTokens;
  }
  interface TypographyVariants {
    wordmark: React.CSSProperties;
    price: React.CSSProperties;
    eyebrow: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    wordmark?: React.CSSProperties;
    price?: React.CSSProperties;
    eyebrow?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    wordmark: true;
    price: true;
    eyebrow: true;
  }
}

export const BODY_FONT =
  'var(--font-jakarta), "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const WORDMARK_FONT = 'var(--font-italiana), "Italiana", Georgia, serif';

export function createZayneTheme(mode: ColorMode) {
  const t = GLOW_TOKENS[mode];

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      background: {
        default: t.ground,
        paper: t.surface,
      },
      text: {
        primary: t.text,
        secondary: t.textSecondary,
      },
      divider: t.divider,
      primary: {
        main: t.action,
        contrastText: t.actionText,
      },
      secondary: {
        main: t.accent,
        contrastText: t.actionText,
      },
      success: {
        main: t.accent,
      },
      glow: { ...t, radii: GLOW_RADII },
      zayne: {
        productTile: t.petal,
        tileRadius: 20,
        modeTransition: MOTION_CURVES.modeCrossfade,
      },
    },
    shape: {
      borderRadius: 4,
    },
    shadows: Array(25).fill('none') as ThemeOptions['shadows'],
    typography: {
      fontFamily: BODY_FONT,
      fontWeightLight: 400,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: {
        fontWeight: 700,
        fontSize: 'clamp(38px, 6vw, 88px)',
        lineHeight: 1.02,
        letterSpacing: '-0.04em',
      },
      h2: {
        fontWeight: 700,
        fontSize: 'clamp(28px, 3.6vw, 52px)',
        lineHeight: 1.04,
        letterSpacing: '-0.035em',
      },
      h3: {
        fontWeight: 700,
        fontSize: 'clamp(19px, 1.7vw, 24px)',
        lineHeight: 1.2,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.0625rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 700,
        fontSize: '0.9375rem',
        lineHeight: 1.35,
      },
      h6: {
        fontWeight: 700,
        fontSize: '0.875rem',
        lineHeight: 1.35,
      },
      body1: {
        fontWeight: 400,
        fontSize: '0.9375rem',
        lineHeight: 1.6,
        '@media (min-width:900px)': {
          fontSize: '1rem',
        },
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.55,
      },
      subtitle1: {
        fontWeight: 600,
        fontSize: '0.9375rem',
        lineHeight: 1.4,
      },
      subtitle2: {
        fontWeight: 600,
        fontSize: '0.8125rem',
        lineHeight: 1.4,
      },
      button: {
        fontWeight: 700,
        fontSize: '0.9375rem',
        lineHeight: 1.3,
        textTransform: 'none',
        letterSpacing: 0,
      },
      caption: {
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: 1.45,
      },
      overline: {
        fontWeight: 700,
        fontSize: '0.78125rem',
        lineHeight: 1.4,
        textTransform: 'none',
        letterSpacing: 0,
      },
      wordmark: {
        fontFamily: WORDMARK_FONT,
        fontWeight: 400,
        fontSize: '1.75rem',
        lineHeight: 1,
        letterSpacing: '0.01em',
      },
      price: {
        fontWeight: 800,
        fontSize: '1.0625rem',
        lineHeight: 1.25,
        fontVariantNumeric: 'tabular-nums',
      },
      eyebrow: {
        fontWeight: 700,
        fontSize: '0.78125rem',
        lineHeight: 1.4,
        color: t.accent,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          html: {
            width: '100%',
            margin: 0,
            padding: 0,
            backgroundColor: t.ground,
            overflowX: 'clip',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
          },
          body: {
            width: '100%',
            maxWidth: 'none',
            margin: 0,
            padding: 0,
            backgroundColor: t.ground,
            color: t.text,
            transition: MOTION_CURVES.modeCrossfade,
            overflowX: 'clip',
          },
          '*:focus-visible': {
            outline: `2px solid ${t.accent}`,
            outlineOffset: '3px',
          },
          '@keyframes glowRise': {
            '0%': { opacity: 0, transform: 'translateY(14px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          '@keyframes heartScalePop': {
            '0%': { transform: 'scale(1)' },
            '45%': { transform: 'scale(1.32)' },
            '100%': { transform: 'scale(1)' },
          },
          '@keyframes badgeBump': {
            '0%': { transform: 'scale(1)' },
            '40%': { transform: 'scale(1.28)' },
            '100%': { transform: 'scale(1)' },
          },
          '@keyframes priceFadeUp': {
            '0%': { opacity: 0, transform: 'translateY(6px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
              scrollBehavior: 'auto !important',
            },
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: 'clamp(16px, 3.5vw, 56px) !important',
            paddingRight: 'clamp(16px, 3.5vw, 56px) !important',
          },
          maxWidthLg: {
            maxWidth: '1320px !important',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          body1: { maxWidth: '68ch' },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            color: t.text,
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            transition: MOTION_CURVES.modeCrossfade,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: GLOW_RADII.pill,
            minHeight: 48,
            padding: '12px 24px',
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            transition: `${MOTION_CURVES.modeCrossfade}, transform 0.2s ${MOTION_CURVES.editorialEase}, opacity 0.2s ease`,
            '&:active': { transform: 'scale(0.98)' },
          },
          sizeLarge: {
            minHeight: 56,
            fontSize: '1rem',
            padding: '14px 28px',
          },
          sizeSmall: {
            minHeight: 36,
            padding: '6px 16px',
            fontSize: '0.8125rem',
          },
          containedPrimary: {
            backgroundColor: t.action,
            color: t.actionText,
            '&:hover': { backgroundColor: t.action, opacity: 0.88, boxShadow: 'none' },
          },
          outlined: {
            border: 'none',
            backgroundColor: t.surface,
            color: t.text,
            '&:hover': { border: 'none', backgroundColor: t.petal },
          },
          // color="inherit" (for example the Snackbar's "View bag") keeps the
          // parent's text color; only default text buttons take the ink.
          text: ({ ownerState }) =>
            ownerState.color === 'inherit'
              ? { '&:hover': { backgroundColor: 'rgba(127, 127, 127, 0.18)' } }
              : { color: t.text, '&:hover': { backgroundColor: t.petal } },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: t.text,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: GLOW_RADII.pill,
            fontWeight: 600,
            fontSize: '0.875rem',
            height: 40,
            paddingInline: 6,
            border: 'none',
            backgroundColor: t.surface,
            color: t.text,
            transition: MOTION_CURVES.modeCrossfade,
            '&.MuiChip-clickable:hover': { backgroundColor: t.petal },
            '&.MuiChip-filledPrimary, &[data-active="true"]': {
              backgroundColor: t.action,
              color: t.actionText,
              '&:hover': { backgroundColor: t.action, opacity: 0.9 },
            },
          },
          sizeSmall: {
            height: 30,
            fontSize: '0.75rem',
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            gap: 0,
            padding: 4,
            borderRadius: GLOW_RADII.pill,
            backgroundColor: t.petal,
          },
          grouped: {
            border: 'none !important',
            borderRadius: `${GLOW_RADII.pill}px !important`,
            margin: '0 !important',
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            flex: 1,
            minHeight: 40,
            padding: '8px 18px',
            border: 'none',
            borderRadius: GLOW_RADII.pill,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: t.text,
            backgroundColor: 'transparent',
            transition: MOTION_CURVES.modeCrossfade,
            '&:hover': { backgroundColor: t.surface },
            '&.Mui-selected': {
              backgroundColor: t.action,
              color: t.actionText,
              '&:hover': { backgroundColor: t.action, opacity: 0.92 },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: GLOW_RADII.input,
            backgroundColor: t.petal,
            minHeight: 52,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: `2px solid ${t.accent}`,
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              border: `2px solid ${t.accent}`,
            },
          },
          input: {
            fontWeight: 500,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { fontWeight: 500, marginLeft: 4 },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 52,
            height: 32,
            padding: 0,
          },
          switchBase: {
            padding: 3,
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: '#FFFFFF',
              '& + .MuiSwitch-track': { backgroundColor: t.action, opacity: 1 },
            },
          },
          thumb: {
            width: 26,
            height: 26,
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            color: '#FFFFFF',
          },
          track: {
            borderRadius: GLOW_RADII.pill,
            backgroundColor: t.mauve,
            opacity: 1,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: t.textSecondary,
            '&.Mui-checked': { color: t.action },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: t.textSecondary,
            '&.Mui-checked': { color: t.action },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: t.ground,
            backgroundImage: 'none',
            borderRadius: GLOW_RADII.tile,
          },
          paperFullScreen: {
            borderRadius: 0,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: t.ground,
            backgroundImage: 'none',
            border: 'none',
          },
          paperAnchorBottom: {
            borderTopLeftRadius: GLOW_RADII.tile,
            borderTopRightRadius: GLOW_RADII.tile,
          },
          paperAnchorRight: {
            borderTopLeftRadius: GLOW_RADII.tile,
            borderBottomLeftRadius: GLOW_RADII.tile,
          },
        },
      },
      MuiAccordion: {
        defaultProps: { elevation: 0, disableGutters: true },
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            borderTop: `1px solid ${t.divider}`,
            '&:first-of-type': { borderTop: 'none' },
            '&::before': { display: 'none' },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: { paddingInline: 0, minHeight: 56 },
          content: { fontWeight: 700 },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: { paddingInline: 0, paddingTop: 0 },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            backgroundColor: t.accent,
            color: mode === 'light' ? '#FFFFFF' : '#150C14',
            fontWeight: 700,
            fontSize: '0.6875rem',
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: t.action,
            color: t.actionText,
            borderRadius: GLOW_RADII.pill,
            boxShadow: t.shadowStrong,
            paddingInline: 20,
            fontWeight: 600,
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: t.petal,
            borderRadius: 24,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: t.divider },
        },
      },
    },
  };

  return createTheme(themeOptions);
}
