import type { Density } from '@/lib/preferences';
import { alpha, createTheme } from '@mui/material/styles';

/**
 * « Le carnet d'Oniria » : la fiche est une feuille de personnage imprimée,
 * remplie à la main. Ce que le joueur écrit est manuscrit, à l'encre bleue ;
 * ce que les règles calculent est tapé à la machine. Le jour, la feuille est
 * posée sur une table claire ; la nuit, la même feuille est éclairée à la
 * bougie. Voir DESIGN.md.
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
    guide: string;
    margin: string;
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
    guide?: string;
    margin?: string;
  }
  interface TypographyVariants {
    numeral: React.CSSProperties;
    hand: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    numeral?: React.CSSProperties;
    hand?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    numeral: true;
    hand: true;
  }
}

/** Machine à écrire : tout ce qui est imprimé ou calculé. */
export const TYPE =
  'var(--font-type), "Courier Prime", "Courier New", monospace';
/** Écriture à la main : tout ce que le joueur écrit. */
export const HAND = 'var(--font-hand), "Segoe Print", cursive';
/** Tampon : titres de page et de section. */
export const STAMP = 'var(--font-stamp), var(--font-type), monospace';

/** Grain du papier, pour les encadrés opaques posés sur la feuille. */
export const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0.12 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

/** Jour : la feuille sur une table claire. */
const day = {
  table: '#e4dcc8',
  paper: '#efe6cf',
  raised: '#f6efdc',
  print: '#3b3328',
  print2: '#665c4b',
  pen: '#23336b',
  guide: 'rgba(62, 79, 140, 0.12)',
  margin: 'rgba(178, 70, 52, 0.32)',
};

/** Nuit : la même feuille à la bougie, papier sourd, table dans l'ombre. */
const candle = {
  table: '#0d0906',
  paper: '#cfbc96',
  raised: '#d9c8a3',
  print: '#3a2a1a',
  print2: '#4a3824',
  pen: '#22305a',
  guide: 'rgba(90, 52, 20, 0.13)',
  margin: 'rgba(150, 60, 30, 0.34)',
};

/** Les états d'un élément d'interface, sur papier (les deux thèmes sont clairs). */
const actions = (ink: string) => ({
  active: alpha(ink, 0.62),
  hover: alpha(ink, 0.06),
  selected: alpha(ink, 0.1),
  disabled: alpha(ink, 0.36),
  disabledBackground: alpha(ink, 0.1),
  focus: alpha(ink, 0.12),
});

const sheet = (p: typeof day) => ({
  background: { default: p.table, paper: p.paper },
  text: {
    primary: p.print,
    secondary: p.print2,
    disabled: alpha(p.print, 0.42),
  },
  divider: alpha(p.print, 0.24),
  rule: alpha(p.print, 0.24),
  raised: p.raised,
  guide: p.guide,
  margin: p.margin,
  action: actions(p.print),
});

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
          ...sheet(candle),
          primary: { main: candle.pen, contrastText: candle.raised },
          // Encres d'état assombries : 4,5:1 au moins sur le papier à la bougie.
          secondary: { main: '#77321a', contrastText: candle.raised },
          error: { main: '#842a1c', contrastText: candle.raised },
          warning: { main: '#78380e', contrastText: candle.raised },
          info: { main: '#254a73', contrastText: candle.raised },
          success: { main: '#22542f', contrastText: candle.raised },
          existence: {
            health: '#9a3a28',
            stability: '#2f5a85',
            radiance: '#86640c',
            mai: '#5a4690',
          },
        },
      },
      light: {
        palette: {
          mode: 'light',
          ...sheet(day),
          primary: { main: day.pen, contrastText: day.raised },
          secondary: { main: '#9a4a2a', contrastText: day.raised },
          error: { main: '#a63a2a' },
          warning: { main: '#924716' },
          info: { main: '#355d8a' },
          success: { main: '#2f6640' },
          existence: {
            health: '#a8432f',
            stability: '#3d6a99',
            radiance: '#9a7414',
            mai: '#6a55a0',
          },
        },
      },
    },
    typography: {
      fontFamily: TYPE,
      fontSize: 14,
      // ONIRIA à l'accueil.
      h1: {
        fontFamily: STAMP,
        fontWeight: 400,
        fontSize: '3.5rem',
        letterSpacing: '0.3em',
        lineHeight: 1.1,
      },
      // Le nom du personnage ou de la table : écrit à la main.
      h2: {
        fontFamily: HAND,
        fontWeight: 600,
        fontSize: '3rem',
        lineHeight: 1,
      },
      // Titre de page (Tables de jeu, Whitelist).
      h3: {
        fontFamily: STAMP,
        fontWeight: 400,
        fontSize: '1.5rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        lineHeight: 1.3,
      },
      // Titre de section : frappé au tampon, suivi d'un filet.
      h4: {
        fontFamily: STAMP,
        fontWeight: 400,
        fontSize: '0.9375rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
      },
      // Titre de groupe (Le Corps, Vue d'ensemble…).
      h5: {
        fontFamily: TYPE,
        fontWeight: 700,
        fontSize: '0.9375rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: TYPE,
        fontWeight: 700,
        fontSize: '0.9375rem',
        lineHeight: 1.35,
      },
      subtitle1: { fontFamily: TYPE, fontSize: '0.9375rem', lineHeight: 1.5 },
      subtitle2: {
        fontFamily: TYPE,
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      },
      body1: { fontSize: '0.9375rem', lineHeight: 1.55 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      caption: { fontSize: '0.75rem', lineHeight: 1.4 },
      // Libellé de champ imprimé : NOM, ÂGE, LA SANTÉ…
      overline: {
        fontFamily: TYPE,
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
      },
      button: {
        fontFamily: TYPE,
        fontWeight: 700,
        fontSize: '0.875rem',
        letterSpacing: '0.02em',
        textTransform: 'none',
      },
      // Valeur calculée par les règles : tapée à la machine.
      numeral: {
        fontFamily: TYPE,
        fontWeight: 700,
        fontVariantNumeric: 'lining-nums tabular-nums',
        lineHeight: 1.2,
      },
      // Valeur écrite par le joueur : à la main, à l'encre bleue.
      hand: {
        fontFamily: HAND,
        fontWeight: 600,
        fontSize: '1.375rem',
        lineHeight: 1.05,
        color: 'var(--mui-palette-primary-main)',
      },
    },
    components: {
      MuiCssBaseline: {
        // Variables CSS, et non theme.palette : la nuit à la bougie a ses
        // propres valeurs.
        styleOverrides: (theme) => ({
          body: { fontVariantNumeric: 'lining-nums tabular-nums' },
          '::selection': {
            background: `color-mix(in srgb, ${theme.vars.palette.primary.main} 22%, transparent)`,
          },
          ':focus-visible': {
            outline: `2px solid ${theme.vars.palette.primary.main}`,
            outlineOffset: 2,
          },
          '*': {
            scrollbarColor: `color-mix(in srgb, ${theme.vars.palette.text.primary} 30%, transparent) transparent`,
          },
          a: { textUnderlineOffset: '0.2em' },
          // Les deux thèmes sont du papier clair : contrôles natifs clairs.
          ':root, :root.dark': { colorScheme: 'light' },
          // Les messages (notistack) : un billet de papier, tapé à la machine.
          '.notistack-MuiContent': {
            backgroundColor: theme.vars.palette.raised,
            color: theme.vars.palette.text.primary,
            border: `1px solid ${theme.vars.palette.text.primary}`,
            fontFamily: TYPE,
            boxShadow: '0 8px 20px -10px rgba(0, 0, 0, 0.45)',
          },
          '.notistack-MuiContent-success': {
            borderColor: theme.vars.palette.success.main,
          },
          '.notistack-MuiContent-error': {
            borderColor: theme.vars.palette.error.main,
          },
          '.notistack-MuiContent-warning': {
            borderColor: theme.vars.palette.warning.main,
          },
          '.notistack-MuiContent-success svg': {
            color: theme.vars.palette.success.main,
          },
          '.notistack-MuiContent-error svg': {
            color: theme.vars.palette.error.main,
          },
          '.notistack-MuiContent-warning svg': {
            color: theme.vars.palette.warning.main,
          },
          // La bougie : un halo ambré en haut à gauche et l'ombre sur les
          // bords seulement, pour que toute la feuille reste lisible.
          ...theme.applyStyles('dark', {
            'body::before, body::after': {
              content: '""',
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1250,
            },
            'body::before': {
              background:
                'radial-gradient(ellipse 60% 70% at 26% 12%, rgba(255, 168, 76, 0.3), rgba(255, 140, 50, 0.08) 45%, transparent 75%)',
              mixBlendMode: 'soft-light',
            },
            'body::after': {
              background:
                'radial-gradient(ellipse 95% 110% at 34% 18%, transparent 55%, rgba(20, 10, 4, 0.12) 80%, rgba(8, 4, 2, 0.45) 100%)',
            },
            '@media (prefers-contrast: more)': {
              'body::before, body::after': { display: 'none' },
            },
          }),
        }),
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.vars.palette.text.primary}`,
            backgroundColor: theme.vars.palette.raised,
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
      // Ce qu'on saisit s'écrit à la main, comme sur la feuille.
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontFamily: HAND,
            fontWeight: 600,
            fontSize: '1.375rem',
            color: 'var(--mui-palette-primary-main)',
          },
        },
      },
      MuiInputLabel: { styleOverrides: { root: { fontFamily: TYPE } } },
      // Le trait sous la saisie : imprimé, comme les lignes de la feuille.
      MuiInput: {
        styleOverrides: {
          underline: ({ theme }) => ({
            '&::before': {
              borderBottomColor: `color-mix(in srgb, ${theme.vars.palette.text.primary} 55%, transparent)`,
            },
            '&:hover:not(.Mui-disabled, .Mui-error)::before': {
              borderBottomColor: theme.vars.palette.text.primary,
            },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: ({ theme }) => ({
            borderColor: `color-mix(in srgb, ${theme.vars.palette.text.primary} 45%, transparent)`,
          }),
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: 44,
            borderBottom: `1px solid ${theme.vars.palette.text.primary}`,
          }),
          indicator: { height: 2 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 44,
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
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
            border: `1px solid ${theme.vars.palette.text.primary}`,
            fontFamily: TYPE,
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.45,
            padding: '8px 12px',
            maxWidth: 380,
          }),
          arrow: ({ theme }) => ({
            color: theme.vars.palette.raised,
            '&::before': {
              border: `1px solid ${theme.vars.palette.text.primary}`,
            },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.vars.palette.rule}`,
            fontSize: '0.875rem',
          }),
          head: ({ theme }) => ({
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            color: theme.vars.palette.text.secondary,
            borderBottom: `1.5px solid ${theme.vars.palette.text.primary}`,
          }),
        },
      },
      MuiChip: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderRadius: 2, fontWeight: 700 } },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            border: `1.5px solid ${theme.vars.palette.text.primary}`,
            outline: `1px solid ${theme.vars.palette.text.primary}`,
            outlineOffset: -6,
            boxShadow: `0 24px 48px -12px ${alpha('#000', 0.45)}`,
          }),
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontFamily: STAMP,
            fontWeight: 400,
            fontSize: '1.0625rem',
            letterSpacing: '0.12em',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            border: `1px solid ${theme.vars.palette.text.primary}`,
          }),
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            border: `1px solid ${theme.vars.palette.text.primary}`,
          }),
        },
      },
      // Une note de marge : papier teinté de la couleur du message, encre
      // d'imprimerie, la même dans les deux thèmes.
      MuiAlert: {
        styleOverrides: {
          root: ({ ownerState }) => {
            const tone = `var(--mui-palette-${ownerState.severity ?? 'info'}-main)`;
            return {
              borderRadius: 2,
              fontFamily: TYPE,
              ...(ownerState.variant !== 'filled' && {
                backgroundColor: `color-mix(in srgb, ${tone} 10%, transparent)`,
                color: 'var(--mui-palette-text-primary)',
                border: `1px solid ${tone}`,
                '& .MuiAlert-icon': { color: tone },
              }),
            };
          },
        },
      },
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
