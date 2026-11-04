import type { Density } from '@/lib/preferences';
import { alpha, createTheme } from '@mui/material/styles';

/**
 * « Éphémérides des Lunes » : la fiche se lit comme une page d'éphémérides.
 * Encre de nuit et os la nuit, papier os et encre le jour ; filets d'un
 * pixel, pas d'ombre au repos, chiffres tabulaires. Voir DESIGN.md.
 */

declare module '@mui/material/styles' {
  interface Palette {
    existence: {
      health: string;
      stability: string;
      radiance: string;
      mai: string;
    };
    rule: string;
    raised: string;
  }
  interface PaletteOptions {
    existence?: {
      health: string;
      stability: string;
      radiance: string;
      mai: string;
    };
    rule?: string;
    raised?: string;
  }
  interface TypographyVariants {
    numeral: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    numeral?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    numeral: true;
  }
}

const SERIF = 'var(--font-spectral), "Iowan Old Style", Georgia, serif';
const SANS = 'var(--font-alegreya), "Segoe UI", system-ui, sans-serif';
const SMALL_CAPS = 'var(--font-alegreya-sc), "Segoe UI", system-ui, sans-serif';

const night = {
  ground: '#11131c',
  paper: '#161925',
  raised: '#1d2130',
  text: '#e8e2d3',
  secondary: '#a9b1c2',
  muted: '#8a91a2',
  rule: alpha('#e8e2d3', 0.12),
};

const day = {
  ground: '#f4efe3',
  paper: '#faf7ef',
  raised: '#fffdf7',
  text: '#1d1f2b',
  secondary: '#555b6b',
  muted: '#6b7080',
  rule: alpha('#1d1f2b', 0.14),
};

export const createOniriaTheme = (density: Density = 'comfortable') => {
  const compact = density === 'compact';

  return createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    spacing: compact ? 6 : 8,
    shape: { borderRadius: 2 },
    colorSchemes: {
      dark: {
        palette: {
          mode: 'dark',
          primary: { main: '#d9a441', contrastText: '#1a1406' },
          secondary: { main: '#b49ad9', contrastText: '#16101f' },
          error: { main: '#e06a5a' },
          warning: { main: '#e8894a' },
          info: { main: '#8fb3d9' },
          success: { main: '#7fb38a' },
          background: { default: night.ground, paper: night.paper },
          text: {
            primary: night.text,
            secondary: night.secondary,
            disabled: alpha(night.text, 0.42),
          },
          divider: night.rule,
          rule: night.rule,
          raised: night.raised,
          existence: {
            health: '#d97a6c',
            stability: '#8fb3d9',
            radiance: '#e9cf7a',
            mai: '#c9b8e8',
          },
        },
      },
      light: {
        palette: {
          mode: 'light',
          primary: { main: '#8a5a12', contrastText: '#fffdf7' },
          secondary: { main: '#6a4fa3' },
          error: { main: '#b23a2a' },
          warning: { main: '#b0561c' },
          info: { main: '#3d6a99' },
          success: { main: '#3f7a4f' },
          background: { default: day.ground, paper: day.paper },
          text: {
            primary: day.text,
            secondary: day.secondary,
            disabled: alpha(day.text, 0.42),
          },
          divider: day.rule,
          rule: day.rule,
          raised: day.raised,
          existence: {
            health: '#a8432f',
            stability: '#3d6a99',
            radiance: '#8a6a10',
            mai: '#6a55a0',
          },
        },
      },
    },
    typography: {
      fontFamily: SANS,
      h1: {
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: '4rem',
        letterSpacing: '0.04em',
        lineHeight: 1.05,
      },
      h2: {
        fontFamily: SERIF,
        fontWeight: 500,
        fontSize: '2.75rem',
        letterSpacing: '-0.005em',
        lineHeight: 1.1,
      },
      h3: {
        fontFamily: SERIF,
        fontWeight: 500,
        fontSize: '2rem',
        lineHeight: 1.15,
      },
      // Titre de section : petites capitales espacées, comme l'en-tête d'une table.
      h4: {
        fontFamily: SMALL_CAPS,
        fontWeight: 700,
        fontSize: '0.9375rem',
        letterSpacing: '0.08em',
        lineHeight: 1.4,
      },
      h5: {
        fontFamily: SERIF,
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.3,
      },
      h6: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: '1.125rem',
        lineHeight: 1.35,
      },
      subtitle1: { fontFamily: SANS, fontSize: '1rem', lineHeight: 1.5 },
      subtitle2: {
        fontFamily: SMALL_CAPS,
        fontWeight: 500,
        fontSize: '0.875rem',
        letterSpacing: '0.06em',
      },
      body1: { fontSize: '1rem', lineHeight: 1.5 },
      body2: { fontSize: '0.9375rem', lineHeight: 1.45 },
      caption: { fontSize: '0.8125rem', lineHeight: 1.4 },
      overline: {
        fontFamily: SMALL_CAPS,
        fontWeight: 500,
        fontSize: '0.8125rem',
        letterSpacing: '0.08em',
        textTransform: 'none',
        lineHeight: 1.4,
      },
      button: {
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: '0.9375rem',
        letterSpacing: '0.01em',
        textTransform: 'none',
      },
      numeral: {
        fontFamily: SERIF,
        fontWeight: 500,
        fontVariantNumeric: 'lining-nums tabular-nums',
        lineHeight: 1.2,
      },
    },
    components: {
      MuiCssBaseline: {
        // Variables CSS, et non theme.palette : sinon la nuit hérite des
        // valeurs du jour (or bruni, encre), illisibles sur fond sombre.
        styleOverrides: (theme) => ({
          body: { fontVariantNumeric: 'lining-nums tabular-nums' },
          '::selection': {
            background: `color-mix(in srgb, ${theme.vars.palette.primary.main} 32%, transparent)`,
          },
          ':focus-visible': {
            outline: `2px solid ${theme.vars.palette.primary.main}`,
            outlineOffset: 2,
          },
          '*': {
            scrollbarColor: `color-mix(in srgb, ${theme.vars.palette.text.primary} 24%, transparent) transparent`,
          },
          a: { textUnderlineOffset: '0.2em' },
        }),
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.vars.palette.rule}`,
            backgroundColor: theme.vars.palette.background.paper,
          }),
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: compact ? 12 : 20,
            '&:last-child': { paddingBottom: compact ? 12 : 20 },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          size: compact ? 'small' : 'medium',
        },
        styleOverrides: { root: { borderRadius: 2 } },
      },
      MuiIconButton: { defaultProps: { size: compact ? 'small' : 'medium' } },
      MuiTabs: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: 44,
            borderBottom: `1px solid ${theme.vars.palette.rule}`,
          }),
          indicator: { height: 2 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 44,
            textTransform: 'none',
            fontSize: '0.9375rem',
            fontWeight: 500,
            paddingInline: 14,
          },
        },
      },
      MuiTooltip: {
        defaultProps: { arrow: true },
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            color: theme.vars.palette.text.primary,
            border: `1px solid ${theme.vars.palette.rule}`,
            fontFamily: SANS,
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.45,
            padding: '8px 12px',
            maxWidth: 380,
          }),
          arrow: ({ theme }) => ({ color: theme.vars.palette.raised }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.vars.palette.rule}`,
          }),
          head: {
            fontFamily: SMALL_CAPS,
            fontWeight: 500,
            letterSpacing: '0.06em',
            fontSize: '0.875rem',
          },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 2 } } },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            border: `1px solid ${theme.vars.palette.rule}`,
            boxShadow: `0 24px 48px -12px ${alpha('#000', 0.5)}`,
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            border: `1px solid ${theme.vars.palette.rule}`,
          }),
        },
      },
      MuiAlert: { styleOverrides: { root: { borderRadius: 2 } } },
      MuiLinearProgress: {
        styleOverrides: { root: { height: 3, borderRadius: 0 } },
      },
      MuiDivider: {
        styleOverrides: {
          root: ({ theme }) => ({ borderColor: theme.vars.palette.rule }),
        },
      },
    },
  });
};
