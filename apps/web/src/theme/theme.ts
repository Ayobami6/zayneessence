import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ColorMode, MOTION_CURVES, PLUM_TOKENS, ZayneCustomTokens } from './tokens';

declare module '@mui/material/styles' {
  interface Palette {
    zayne: ZayneCustomTokens;
  }
  interface PaletteOptions {
    zayne?: ZayneCustomTokens;
  }
}

const DISPLAY_FONT = 'var(--font-italiana), "Italiana", Georgia, serif';
const BODY_FONT = 'var(--font-jost), "Jost", -apple-system, BlinkMacSystemFont, sans-serif';

export function createZayneTheme(mode: ColorMode) {
  const t = PLUM_TOKENS[mode];

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      background: {
        default: t.background,
        paper: t.paper,
      },
      text: {
        primary: t.textPrimary,
        secondary: t.textSecondary,
      },
      divider: t.divider,
      primary: {
        main: t.primaryBg,
        contrastText: t.primaryText,
      },
      secondary: {
        main: t.textSecondary,
        contrastText: t.background,
      },
      error: {
        main: t.textPrimary,
      },
      success: {
        main: t.primaryBg,
      },
      zayne: {
        productTile: t.productTile,
        tileInnerArch: t.tileInnerArch,
        primaryButtonBg: t.primaryBg,
        primaryButtonText: t.primaryText,
        headerGlass: t.headerGlass,
        archRadius: '999px 999px 6px 6px',
        innerArchRadius: '999px 999px 4px 4px',
        pillRadius: 999,
        tileRadius: 4,
        modeTransition: MOTION_CURVES.modeCrossfade,
      },
    },
    shape: {
      borderRadius: 4,
    },
    shadows: Array(25).fill('none') as ThemeOptions['shadows'],
    typography: {
      fontFamily: BODY_FONT,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      h1: {
        fontFamily: DISPLAY_FONT,
        fontWeight: 400,
        fontSize: 'clamp(52px, 11vw, 104px)',
        lineHeight: 0.98,
        letterSpacing: '-0.015em',
        maxWidth: '9ch',
        textTransform: 'none',
        WebkitTextStroke: '0.2px currentColor',
      },
      h2: {
        fontFamily: DISPLAY_FONT,
        fontWeight: 400,
        fontSize: 'clamp(32px, 4.5vw, 50px)',
        lineHeight: 1.08,
        letterSpacing: '-0.01em',
        textTransform: 'none',
        WebkitTextStroke: '0.25px currentColor',
      },
      h3: {
        fontFamily: DISPLAY_FONT,
        fontWeight: 400,
        fontSize: 'clamp(24px, 3vw, 35px)',
        lineHeight: 1.15,
        textTransform: 'none',
        WebkitTextStroke: '0.22px currentColor',
      },
      h4: {
        fontFamily: DISPLAY_FONT,
        fontWeight: 400,
        fontSize: 'clamp(20px, 2.2vw, 26px)',
        lineHeight: 1.22,
        textTransform: 'none',
        WebkitTextStroke: '0.2px currentColor',
      },
      body1: {
        fontFamily: BODY_FONT,
        fontWeight: 400,
        fontSize: '1.125rem',
        lineHeight: 1.65,
        letterSpacing: '0.005em',
      },
      body2: {
        fontFamily: BODY_FONT,
        fontWeight: 400,
        fontSize: '1.03125rem',
        lineHeight: 1.62,
        letterSpacing: '0.005em',
      },
      button: {
        fontFamily: BODY_FONT,
        fontWeight: 500,
        fontSize: '0.96875rem',
        lineHeight: 1.4,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
      caption: {
        fontFamily: BODY_FONT,
        fontWeight: 400,
        fontSize: '0.9375rem',
        lineHeight: 1.55,
        textTransform: 'none',
      },
      overline: {
        fontFamily: BODY_FONT,
        fontWeight: 500,
        fontSize: '0.9375rem',
        textTransform: 'none',
        letterSpacing: 'normal',
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
            backgroundColor: t.background,
            overflowX: 'clip',
            textRendering: 'optimizeLegibility',
          },
          body: {
            width: '100%',
            maxWidth: 'none',
            margin: 0,
            padding: 0,
            backgroundColor: t.background,
            color: t.textPrimary,
            transition: MOTION_CURVES.modeCrossfade,
            overflowX: 'clip',
            textRendering: 'optimizeLegibility',
          },
          '*:focus-visible': {
            outline: `2px solid ${t.primaryBg}`,
            outlineOffset: '3px',
          },
          '@keyframes heroHeadlineSettle': {
            '0%': {
              opacity: 0,
              letterSpacing: '0.045em',
              transform: 'translateY(10px)',
            },
            '100%': {
              opacity: 1,
              letterSpacing: '-0.015em',
              transform: 'translateY(0)',
            },
          },
          '@keyframes heroArchRise': {
            '0%': {
              opacity: 0,
              transform: 'translateY(28px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
          '@keyframes heroLightSweep': {
            '0%, 72%': {
              transform: 'translateX(-140%) skewX(-18deg)',
              opacity: 0,
            },
            '80%': {
              opacity: 0.35,
            },
            '100%': {
              transform: 'translateX(220%) skewX(-18deg)',
              opacity: 0,
            },
          },
          '@keyframes heartScalePop': {
            '0%': {
              transform: 'scale(1)',
            },
            '45%': {
              transform: 'scale(1.32)',
            },
            '100%': {
              transform: 'scale(1)',
            },
          },
          '@keyframes badgeBump': {
            '0%': {
              transform: 'scale(1)',
            },
            '40%': {
              transform: 'scale(1.28)',
            },
            '100%': {
              transform: 'scale(1)',
            },
          },
          '@keyframes priceFadeUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(6px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
          '@keyframes paradeMarquee': {
            '0%': {
              transform: 'translateX(0%)',
            },
            '100%': {
              transform: 'translateX(-50%)',
            },
          },
          '@keyframes pulseDot': {
            '0%, 100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
            '50%': {
              opacity: 0.45,
              transform: 'scale(0.85)',
            },
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
            paddingLeft: 'clamp(16px, 3.5vw, 48px) !important',
            paddingRight: 'clamp(16px, 3.5vw, 48px) !important',
          },
          maxWidthLg: {
            maxWidth: '1760px !important',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          body1: {
            maxWidth: '68ch',
          },
          body2: {
            maxWidth: '68ch',
          },
        },
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundColor: t.headerGlass,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            color: t.textPrimary,
            borderBottom: `1px solid ${t.divider}`,
            boxShadow: 'none',
            backgroundImage: 'none',
            transition: MOTION_CURVES.modeCrossfade,
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            transition: MOTION_CURVES.modeCrossfade,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: '12px 26px',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.96875rem',
            boxShadow: 'none',
            transition: `${MOTION_CURVES.modeCrossfade}, transform 0.25s ${MOTION_CURVES.editorialEase}, opacity 0.2s ease`,
          },
          containedPrimary: {
            backgroundColor: t.primaryBg,
            color: t.primaryText,
            '&:hover': {
              backgroundColor: t.primaryBg,
              opacity: 0.9,
              boxShadow: 'none',
            },
          },
          outlined: {
            borderColor: t.divider,
            color: t.textPrimary,
            '&:hover': {
              borderColor: t.textPrimary,
              backgroundColor: t.productTile,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontFamily: BODY_FONT,
            fontWeight: 500,
            fontSize: '0.95rem',
            height: 42,
            paddingInline: 8,
            border: `1px solid ${t.divider}`,
            backgroundColor: t.paper,
            color: t.textPrimary,
            transition: MOTION_CURVES.modeCrossfade,
            '&.MuiChip-filledPrimary, &[data-active="true"]': {
              backgroundColor: t.primaryBg,
              color: t.primaryText,
              borderColor: t.primaryBg,
            },
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            gap: 8,
            flexWrap: 'wrap',
          },
          grouped: {
            borderRadius: '999px !important',
            border: `1px solid ${t.divider} !important`,
            margin: 0,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: '9px 22px',
            textTransform: 'none',
            fontFamily: BODY_FONT,
            fontWeight: 500,
            fontSize: '0.95rem',
            color: t.textPrimary,
            backgroundColor: t.paper,
            transition: MOTION_CURVES.modeCrossfade,
            '&.Mui-selected': {
              backgroundColor: t.primaryBg,
              color: t.primaryText,
              borderColor: `${t.primaryBg} !important`,
              '&:hover': {
                backgroundColor: t.primaryBg,
                opacity: 0.92,
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: t.background,
            backgroundImage: 'none',
            boxShadow: 'none',
            border: `1px solid ${t.divider}`,
            borderRadius: 6,
          },
          paperFullScreen: {
            borderRadius: 0,
            border: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: t.paper,
            backgroundImage: 'none',
            boxShadow: 'none',
            borderColor: t.divider,
          },
        },
      },
      MuiAccordion: {
        defaultProps: {
          elevation: 0,
          disableGutters: true,
        },
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            borderTop: `1px solid ${t.divider}`,
            '&:last-of-type': {
              borderBottom: `1px solid ${t.divider}`,
            },
            '&::before': {
              display: 'none',
            },
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: t.headerGlass,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderTop: `1px solid ${t.divider}`,
            height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: t.textSecondary,
            '&.Mui-selected': {
              color: t.textPrimary,
            },
          },
          label: {
            fontFamily: BODY_FONT,
            fontSize: '0.75rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
              fontWeight: 500,
            },
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            backgroundColor: t.primaryBg,
            color: t.primaryText,
            fontFamily: BODY_FONT,
            fontWeight: 500,
            fontSize: '0.75rem',
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: t.primaryBg,
            color: t.primaryText,
            borderRadius: 999,
            boxShadow: 'none',
            paddingInline: 20,
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: t.productTile,
            borderRadius: 4,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
}
