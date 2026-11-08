import type { Density } from '@/lib/preferences';
import { alpha, createTheme, type TypographyStyle } from '@mui/material/styles';
import {
  CANDLE,
  CANDLE_EXISTENCES,
  CANDLE_INKS,
  DAY,
  DAY_EXISTENCES,
  DAY_INKS,
} from './palette';

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
    handValue: React.CSSProperties;
    // Style MUI (et non React) : la taille change avec la largeur.
    handExistence: TypographyStyle;
  }
  interface TypographyVariantsOptions {
    numeral?: React.CSSProperties;
    hand?: React.CSSProperties;
    handValue?: React.CSSProperties;
    handExistence?: TypographyStyle;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    numeral: true;
    hand: true;
    handValue: true;
    handExistence: true;
  }
}

/** Machine à écrire : tout ce qui est imprimé ou calculé. */
export const TYPE =
  'var(--font-type), "Courier Prime", "Courier New", monospace';
/** Écriture à la main : tout ce que le joueur écrit. */
export const HAND = 'var(--font-hand), "Segoe Print", cursive';
/** Tampon : titres de page et de section. */
export const STAMP = 'var(--font-stamp), var(--font-type), monospace';

/**
 * Le mouvement du carnet. Une seule signature : l'écriture. Une valeur
 * écrite ou changée se trace de gauche à droite comme à la plume ; validée,
 * elle sèche (couleur d'aperçu → encre). Le reste explique un état ou une
 * continuité, vite. Voir DESIGN.md.
 */
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
/** Ce qui s'en va : il accélère et quitte la feuille. */
export const EASE_LEAVE = 'cubic-bezier(0.4, 0, 1, 1)';
/** La plume : un tracé régulier, qui ralentit seulement en fin de mot. */
export const EASE_PEN = 'cubic-bezier(0.45, 0.05, 0.35, 1)';
export const MOTION = {
  /** Retour immédiat : survol, appui. */
  quick: 120,
  /** Ce qui s'en va : plus vite qu'il n'est arrivé. */
  leave: 160,
  /** Changement d'état courant. */
  state: 220,
  /**
   * Ce qui arrive sur la feuille : la barre des points, le bandeau des
   * Existences, un billet, un point gagné.
   */
  arrive: 280,
  /** Une valeur qui s'écrit. */
  write: 420,
  /** L'encre qui sèche (aperçu validé). */
  dry: 600,
} as const;

/**
 * Les filets imprimés (voir DESIGN.md, Shapes). Des valeurs CSS complètes :
 * `border`, `borderBottom`, `outline`… les prennent telles quelles, et
 * l'encre suit le thème (variables CSS).
 */
export const RULES = {
  /** Encadré imprimé : plaque, Existences, portrait, dialogue. */
  frame: '1.5px solid var(--mui-palette-text-primary)',
  /** Sous un titre de groupe ou une tête de tableau. */
  group: '1.5px solid var(--mui-palette-text-primary)',
  /** Filet d'encre : papier relevé, séparation de colonnes, onglets. */
  ink: '1px solid var(--mui-palette-text-primary)',
  /** Filet fin entre deux lignes, et cadre des −|+. */
  hairline: '1px solid var(--mui-palette-rule)',
} as const;

/**
 * Les requêtes de la feuille, nommées d'après DESIGN.md (Layout). Avec
 * `@media` : elles servent de clé dans `sx`, et `useMediaQuery` les accepte
 * telles quelles.
 */
export const MEDIA = {
  /** Au doigt, quelle que soit la largeur : cibles de 44 px. */
  touch: '@media (pointer: coarse)',
  /** Au doigt, sous 520 px : un groupe de caractères par ligne. */
  touchNarrow: '@media (pointer: coarse) and (max-width: 519.95px)',
  /**
   * Petit écran (étroit, ou paysage peu haut) : l'encadré des Existences
   * défile avec la feuille, un bandeau d'une ligne prend sa place.
   */
  smallScreen: '@media (max-width: 599.95px), (max-height: 500px)',
  /** Les quatre planètes des Existences sur une ligne. */
  planetsRow: '@media (min-width: 520px)',
  /** Trois groupes de caractères (et colonnes de Facultés) côte à côte. */
  threeGroups: '@media (min-width: 640px)',
  /** Portrait, nom et faits de la plaque sur une ligne. */
  plateRow: '@media (min-width: 760px)',
  /** Caractères, Facultés et combat sur un seul écran. */
  oneScreen: '@media (min-width: 1440px)',
} as const;

/** Grain du papier, pour les encadrés opaques posés sur la feuille. */
export const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0.12 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

/** Les états d'un élément d'interface, sur papier (les deux thèmes sont clairs). */
const actions = (ink: string) => ({
  active: alpha(ink, 0.62),
  hover: alpha(ink, 0.06),
  selected: alpha(ink, 0.1),
  disabled: alpha(ink, 0.36),
  disabledBackground: alpha(ink, 0.1),
  focus: alpha(ink, 0.12),
});

const sheet = (p: typeof DAY) => ({
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
          ...sheet(CANDLE),
          primary: { main: CANDLE.pen, contrastText: CANDLE.raised },
          // Encres d'état assombries : 4,5:1 au moins sur le papier à la bougie.
          secondary: {
            main: CANDLE_INKS.secondary,
            contrastText: CANDLE.raised,
          },
          error: { main: CANDLE_INKS.error, contrastText: CANDLE.raised },
          warning: { main: CANDLE_INKS.warning, contrastText: CANDLE.raised },
          info: { main: CANDLE_INKS.info, contrastText: CANDLE.raised },
          success: { main: CANDLE_INKS.success, contrastText: CANDLE.raised },
          existence: { ...CANDLE_EXISTENCES },
        },
      },
      light: {
        palette: {
          mode: 'light',
          ...sheet(DAY),
          primary: { main: DAY.pen, contrastText: DAY.raised },
          secondary: { main: DAY_INKS.secondary, contrastText: DAY.raised },
          error: { main: DAY_INKS.error },
          warning: { main: DAY_INKS.warning },
          info: { main: DAY_INKS.info },
          success: { main: DAY_INKS.success },
          existence: { ...DAY_EXISTENCES },
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
        textWrap: 'balance',
      },
      // Le nom du personnage ou de la table : écrit à la main.
      h2: {
        fontFamily: HAND,
        fontWeight: 600,
        fontSize: '3rem',
        lineHeight: 1,
        textWrap: 'balance',
      },
      // Titre de page (Tables de jeu, Whitelist).
      h3: {
        fontFamily: STAMP,
        fontWeight: 400,
        fontSize: '1.5rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        lineHeight: 1.3,
        textWrap: 'balance',
      },
      // Titre de section : frappé au tampon, suivi d'un filet.
      h4: {
        fontFamily: STAMP,
        fontWeight: 400,
        fontSize: '0.9375rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
        textWrap: 'balance',
      },
      // Titre de groupe (Le Corps, Vue d'ensemble…).
      h5: {
        fontFamily: TYPE,
        fontWeight: 700,
        fontSize: '0.9375rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
        textWrap: 'balance',
      },
      h6: {
        fontFamily: TYPE,
        fontWeight: 700,
        fontSize: '0.9375rem',
        lineHeight: 1.35,
        textWrap: 'balance',
      },
      subtitle1: { fontFamily: TYPE, fontSize: '0.9375rem', lineHeight: 1.5 },
      subtitle2: {
        fontFamily: TYPE,
        fontWeight: 400,
        fontSize: '0.75rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      },
      // Pas de mot seul en fin de paragraphe (descriptions, règles).
      body1: { fontSize: '0.9375rem', lineHeight: 1.55, textWrap: 'pretty' },
      body2: { fontSize: '0.875rem', lineHeight: 1.5, textWrap: 'pretty' },
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
      // Valeur calculée par les règles : tapée à la machine. Une seule taille
      // sur les lignes (Facultés, combat) ; les totaux la grossissent.
      numeral: {
        fontFamily: TYPE,
        fontWeight: 700,
        fontSize: '0.9375rem',
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
      // Un caractère, écrit sur sa ligne (Force, Raisonnement…).
      handValue: {
        fontFamily: HAND,
        fontWeight: 700,
        fontSize: '1.625rem',
        lineHeight: 0.9,
        color: 'var(--mui-palette-primary-main)',
      },
      // L'Existence en cours, à côté de sa planète.
      handExistence: {
        fontFamily: HAND,
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 0.95,
        color: 'var(--mui-palette-primary-main)',
        '@media (min-width: 900px)': { fontSize: '2.375rem' },
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
          // L'écriture : la valeur se trace de gauche à droite (la marge
          // négative laisse dépasser la pente de l'écriture).
          '@keyframes oniria-write': {
            from: { clipPath: 'inset(-25% 100% -25% -10%)' },
            to: { clipPath: 'inset(-25% -15% -25% -10%)' },
          },
          '.oniria-write': {
            display: 'inline-block',
            animation: `oniria-write ${MOTION.write}ms ${EASE_PEN} both`,
          },
          // Le trait qui barre une ancienne valeur, tiré à la plume.
          '@keyframes oniria-strike': {
            from: { backgroundSize: '0% 1.5px' },
            to: { backgroundSize: '100% 1.5px' },
          },
          // Un onglet qui s'ouvre, une feuille qui se pose.
          '@keyframes oniria-panel': {
            from: { opacity: 0, transform: 'translateY(6px)' },
            to: { opacity: 1, transform: 'none' },
          },
          '@keyframes oniria-fade': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          // Une page du carnet qui tourne : le contenu arrive du côté de
          // l'onglet choisi.
          '@keyframes oniria-page-next': {
            from: { opacity: 0, transform: 'translateX(16px)' },
            to: { opacity: 1, transform: 'none' },
          },
          '@keyframes oniria-page-prev': {
            from: { opacity: 0, transform: 'translateX(-16px)' },
            to: { opacity: 1, transform: 'none' },
          },
          // Un point perdu : une onde d'encre part de la planète.
          '@keyframes oniria-ripple': {
            from: { opacity: 0.6, transform: 'scale(1)' },
            to: { opacity: 0, transform: 'scale(1.9)' },
          },
          // Même onde en mouvement réduit : elle s'allume et s'éteint sur place.
          '@keyframes oniria-ripple-flash': {
            '0%, 100%': { opacity: 0 },
            '30%': { opacity: 0.55 },
          },
          // Le tampon s'abat : un peu grand et penché, il se pose.
          '@keyframes oniria-stamp': {
            '0%': { opacity: 0, transform: 'scale(1.4) rotate(-7deg)' },
            '55%': { opacity: 1, transform: 'scale(0.94) rotate(-1deg)' },
            '100%': { opacity: 1, transform: 'none' },
          },
          // L'XP reçue : la part restante se remplit de gauche à droite.
          '@keyframes oniria-fill': {
            from: { transform: 'scaleX(0)' },
            to: { transform: 'scaleX(1)' },
          },
          // Un billet glissé sur la feuille, à peine penché.
          '@keyframes oniria-billet': {
            from: { opacity: 0, transform: 'translateX(28px) rotate(-1.5deg)' },
            to: { opacity: 1, transform: 'none' },
          },
          // Un dialogue qui se pose sur la feuille.
          '@keyframes oniria-pose': {
            from: {
              opacity: 0,
              transform: 'translateY(-10px) rotate(0.6deg) scale(0.985)',
            },
            to: { opacity: 1, transform: 'none' },
          },
          // Bascule Jour / Nuit (View Transitions) : un fondu enchaîné.
          '::view-transition-old(root), ::view-transition-new(root)': {
            animationDuration: '450ms',
            animationTimingFunction: 'ease-out',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '.oniria-write': { animation: 'none' },
            // Billets et dialogues : un fondu, sans glissement ni rotation.
            '.notistack-MuiContent, .MuiDialog-paper': {
              animationName: 'oniria-fade !important',
            },
          },
          // Les deux thèmes sont du papier clair : contrôles natifs clairs.
          ':root, :root.dark': { colorScheme: 'light' },
          // Les messages (notistack) : un billet de papier, tapé à la machine.
          '.notistack-MuiContent': {
            backgroundColor: theme.vars.palette.raised,
            color: theme.vars.palette.text.primary,
            border: RULES.ink,
            fontFamily: TYPE,
            boxShadow: '0 8px 20px -10px rgba(0, 0, 0, 0.45)',
            animation: `oniria-billet ${MOTION.arrive}ms ${EASE} both`,
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
          // bords seulement, pour que toute la feuille reste lisible. Elle
          // s'allume, puis reste fixe : un vacillement en boucle ferait
          // recomposer toute la page à chaque image, tant qu'elle est ouverte.
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
              animation: 'oniria-fade 700ms ease-out both',
            },
            'body::after': {
              background:
                'radial-gradient(ellipse 95% 110% at 34% 18%, transparent 55%, rgba(20, 10, 4, 0.12) 80%, rgba(8, 4, 2, 0.45) 100%)',
              animation: 'oniria-fade 700ms ease-out both',
            },
            '@media (prefers-reduced-motion: reduce)': {
              'body::before': { animation: 'oniria-fade 300ms ease-out both' },
            },
            '@media (prefers-contrast: more)': {
              'body::before, body::after': { display: 'none' },
            },
          }),
        }),
      },
      // Pas d'onde Material : un bouton pressé s'enfonce, comme un tampon.
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: RULES.ink,
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
        styleOverrides: {
          root: {
            borderRadius: 2,
            transition: `background-color ${MOTION.quick}ms ease-out, color ${MOTION.quick}ms ease-out, transform 80ms ease-out`,
            '&:active': { transform: 'translateY(1px)' },
            // Au doigt, 44 px de haut : le texte ne grossit pas, la cible si.
            [MEDIA.touch]: { minHeight: 44 },
          },
        },
      },
      MuiIconButton: {
        defaultProps: { size: compact ? 'small' : 'medium' },
        styleOverrides: {
          root: {
            transition: `background-color ${MOTION.quick}ms ease-out, color ${MOTION.quick}ms ease-out, transform 80ms ease-out`,
            '&:active': { transform: 'translateY(1px)' },
            [MEDIA.touch]: { minWidth: 44, minHeight: 44 },
          },
        },
      },
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
          root: { minHeight: 44, borderBottom: RULES.ink },
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
        // Au doigt, la règle s'ouvre d'un toucher (et non d'un appui long)
        // et reste le temps de la lire.
        defaultProps: {
          arrow: true,
          enterTouchDelay: 0,
          leaveTouchDelay: 5000,
        },
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            color: theme.vars.palette.text.primary,
            border: RULES.ink,
            fontFamily: TYPE,
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.45,
            padding: '8px 12px',
            // Le texte des règles se lit : 46 signes par ligne, pas moins.
            maxWidth: 'calc(46ch + 24px)',
            textWrap: 'pretty',
          }),
          arrow: ({ theme }) => ({
            color: theme.vars.palette.raised,
            '&::before': {
              border: RULES.ink,
            },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: RULES.hairline, fontSize: '0.875rem' },
          head: ({ theme }) => ({
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            // Un libellé de colonne ne se coupe pas (« Enc. (%) ») : le
            // tableau défile plutôt.
            whiteSpace: 'nowrap',
            color: theme.vars.palette.text.secondary,
            borderBottom: RULES.group,
          }),
        },
      },
      MuiChip: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: { root: { borderRadius: 2, fontWeight: 700 } },
      },
      MuiDialog: {
        // Il se pose (260 ms) et s'en va plus vite qu'il n'arrive.
        defaultProps: {
          transitionDuration: { enter: 260, exit: MOTION.leave },
        },
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            border: RULES.frame,
            outline: RULES.ink,
            outlineOffset: -6,
            boxShadow: `0 24px 48px -12px ${alpha('#000', 0.45)}`,
            animation: `oniria-pose 260ms ${EASE} both`,
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
            border: RULES.ink,
          }),
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.vars.palette.raised,
            border: RULES.ink,
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
