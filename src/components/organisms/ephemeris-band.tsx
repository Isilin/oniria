'use client';

import { FullSheet } from '@/lib/db/sheet';
import { useSheet } from '@/lib/hooks/use-sheet';
import { EASE, PAPER_GRAIN } from '@/theme/theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  ButtonBase,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import Written from '../atoms/written';
import MoonGauge from '../molecules/moon-gauge';

type Field =
  'current_health' | 'current_stability' | 'current_radiance' | 'current_mai';

/** Au-delà de cette largeur, les quatre lunes tiennent sur une ligne. */
const WIDE = '@media (min-width: 520px)';

/**
 * Téléphone (portrait ou paysage) : l'encadré complet prendrait un quart à
 * un tiers de l'écran s'il restait collé. Il défile avec la feuille, et une
 * bande d'une ligne prend sa place en haut ; un toucher la déplie.
 */
const SMALL_SCREEN = '(max-width: 599.95px), (max-height: 500px)';
// Clé de style déjà écrite : le React Compiler ne sait pas mémoriser un
// objet dont une clé est un gabarit (`@media ${…}`).
const SMALL_SCREEN_MEDIA = `@media ${SMALL_SCREEN}`;

/** Une planète en miniature, pour la bande : le disque et sa couleur. */
const MiniPlanet = ({ color }: { color: string }) => (
  <Box
    component="svg"
    viewBox="0 0 16 16"
    aria-hidden
    sx={{ width: 14, height: 14, flexShrink: 0 }}
  >
    <circle cx="8" cy="8" r="6" fill={color} fillOpacity="0.62" />
    <circle
      cx="8"
      cy="8"
      r="6"
      fill="none"
      stroke="var(--mui-palette-text-primary)"
      strokeWidth="1"
    />
  </Box>
);

/** Légende d'une colonne d'éphéméride : petites capitales et filet courant. */
const Caption = ({
  children,
  area,
  wideOnly = false,
}: {
  children: string;
  area: string;
  /** Sur téléphone, la jauge porte déjà ce libellé. */
  wideOnly?: boolean;
}) => (
  <Typography
    variant="overline"
    component="p"
    color="textSecondary"
    sx={{
      gridArea: area,
      display: wideOnly ? 'none' : 'flex',
      [WIDE]: { display: 'flex' },
      alignItems: 'center',
      gap: 1,
      '&::after': {
        content: '""',
        flex: 1,
        height: '1px',
        bgcolor: 'text.primary',
      },
    }}
  >
    {children}
  </Typography>
);

/**
 * L'encadré des Existences : les trois Existences, puis le Maï à part, en
 * petites planètes. Collé en haut de la fiche sur tous les onglets.
 */
const EphemerisBand = ({ id }: { id: string }) => {
  const { sheet, computed, base, canEdit, update } = useSheet(id);
  const theme = useTheme();
  const smallScreen = useMediaQuery(SMALL_SCREEN);
  const boxRef = useRef<HTMLElement>(null);
  // L'encadré est passé au-dessus de l'écran : la bande le remplace.
  const [scrolledPast, setScrolledPast] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!smallScreen || !box) {
      setScrolledPast(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      setScrolledPast(past);
      // De retour en haut de la feuille : la bande se replie d'elle-même.
      if (!past) setOpen(false);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [smallScreen, sheet]);

  if (!sheet || !computed) return null;
  const colors = theme.vars!.palette.existence;

  const gauges: {
    label: string;
    field: Field;
    max: number;
    threshold?: number;
    before: { max: number; threshold?: number };
    hint: string;
    color: string;
    area: string;
  }[] = [
    {
      label: 'La Santé',
      field: 'current_health',
      max: computed.health,
      threshold: computed.healthThreshold,
      before: { max: base.health, threshold: base.healthThreshold },
      hint: 'Vigueur / 10, plus les bonus « Santé +N » du Corpus',
      color: colors.health,
      area: 'g1',
    },
    {
      label: "L'Équilibre",
      field: 'current_stability',
      max: computed.stability,
      threshold: computed.stabilityThreshold,
      before: { max: base.stability, threshold: base.stabilityThreshold },
      hint: 'Entendement / 10',
      color: colors.stability,
      area: 'g2',
    },
    {
      label: "L'Éclat",
      field: 'current_radiance',
      max: computed.radiance,
      threshold: computed.radianceThreshold,
      before: { max: base.radiance, threshold: base.radianceThreshold },
      hint: 'Âme / 10',
      color: colors.radiance,
      area: 'g3',
    },
    {
      label: 'Maï',
      field: 'current_mai',
      max: computed.mai,
      before: { max: base.mai },
      hint: 'Âme / 10',
      color: colors.mai,
      area: 'g4',
    },
  ];

  const values = gauges.map((g) => ({
    ...g,
    current: (sheet as FullSheet)[g.field] ?? g.max,
  }));

  const grid = {
    width: '100%',
    display: 'grid',
    columnGap: 0,
    rowGap: 0.75,
    px: { xs: 1, md: 2 },
    py: { xs: 0.75, md: 1 },
    // Un encadré imprimé, opaque : il reste collé en haut pendant qu'on
    // fait défiler la feuille sous lui.
    bgcolor: 'background.paper',
    backgroundImage: PAPER_GRAIN,
    border: '1.5px solid',
    borderColor: 'text.primary',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gridTemplateAreas: '"ce ce ce" "g1 g2 g3" "g4 g4 g4"',
    [WIDE]: {
      gridTemplateColumns: 'repeat(3, minmax(0, 3fr)) minmax(0, 2.4fr)',
      gridTemplateAreas: '"ce ce ce cm" "g1 g2 g3 g4"',
    },
  } as const;

  const content = (
    <>
      <Caption area="ce">Existences</Caption>
      <Caption area="cm" wideOnly>
        Maï
      </Caption>
      {values.map((g, index) => {
        const current = g.current;
        return (
          <Box
            key={g.field}
            // Un filet d'un pixel entre les colonnes, comme une table.
            sx={{
              gridArea: g.area,
              minWidth: 0,
              px: { xs: 0.75, md: 1.5 },
              // Téléphone : filets entre les trois Existences, le Maï sous un filet.
              borderLeft: index === 1 || index === 2 ? 1 : 0,
              borderTop: index === 3 ? 1 : 0,
              borderColor: 'text.primary',
              ...(index === 3 && { pt: 0.75 }),
              [WIDE]: {
                borderLeft: index > 0 ? 1 : 0,
                borderTop: 0,
                pt: 0,
                borderColor: 'text.primary',
              },
            }}
          >
            <MoonGauge
              label={g.label}
              current={current}
              max={g.max}
              threshold={g.threshold}
              before={g.before}
              hint={g.hint}
              color={g.color}
              small={g.field === 'current_mai'}
              inline={g.field === 'current_mai'}
              labelHiddenWide={g.field === 'current_mai'}
              editable={canEdit}
              onChange={(value) => update({ [g.field]: value })}
            />
          </Box>
        );
      })}
    </>
  );

  const showBand = smallScreen && scrolledPast;

  return (
    <>
      <Box
        component="section"
        ref={boxRef}
        aria-label="Existences et Maï"
        sx={{
          ...grid,
          // Collé en haut sur tous les onglets, sauf sur petit écran (voir
          // SMALL_SCREEN) où la bande prend le relais.
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
          [SMALL_SCREEN_MEDIA]: { position: 'static' },
        }}
      >
        {content}
      </Box>
      {smallScreen && (
        <Box
          inert={!showBand}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 'appBar',
            px: 1,
            pt: 'env(safe-area-inset-top)',
            bgcolor: 'background.paper',
            backgroundImage: PAPER_GRAIN,
            borderBottom: '1.5px solid',
            borderColor: 'text.primary',
            maxHeight: '100svh',
            overflowY: 'auto',
            // Elle descend comme la barre des points monte : vite à
            // l'arrivée, plus vite au départ.
            transform: showBand ? 'none' : 'translateY(-100%)',
            visibility: showBand ? 'visible' : 'hidden',
            transition: showBand
              ? `transform 280ms ${EASE}, visibility 0s`
              : 'transform 160ms ease-in, visibility 0s linear 160ms',
            '@media (prefers-reduced-motion: reduce)': {
              transform: 'none',
              opacity: showBand ? 1 : 0,
              transition: showBand
                ? 'opacity 160ms ease-out, visibility 0s'
                : 'opacity 160ms ease-out, visibility 0s linear 160ms',
            },
          }}
        >
          {open ? (
            <Box sx={{ py: 0.75 }}>
              <Box component="section" aria-label="Existences et Maï" sx={grid}>
                {content}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  onClick={() => setOpen(false)}
                  aria-expanded
                  startIcon={
                    <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />
                  }
                >
                  Replier
                </Button>
              </Box>
            </Box>
          ) : (
            <ButtonBase
              onClick={() => setOpen(true)}
              aria-expanded={false}
              aria-label={`Existences : ${values
                .map((g) => `${g.label} ${g.current} sur ${g.max}`)
                .join(', ')}. Afficher les −/+.`}
              sx={{
                width: '100%',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'space-between',
              }}
            >
              {values.map((g) => (
                <Box
                  key={g.field}
                  aria-hidden
                  sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}
                >
                  <Box sx={{ alignSelf: 'center', display: 'flex' }}>
                    <MiniPlanet color={g.color} />
                  </Box>
                  <Typography variant="hand" sx={{ fontWeight: 700 }}>
                    <Written value={g.current}>{g.current}</Written>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    / {g.max}
                  </Typography>
                </Box>
              ))}
              <ExpandMoreIcon
                fontSize="small"
                sx={{ color: 'text.secondary', flexShrink: 0 }}
              />
            </ButtonBase>
          )}
        </Box>
      )}
    </>
  );
};

export default EphemerisBand;
