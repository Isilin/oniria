'use client';

import { FullSheet } from '@/lib/db/sheet';
import { useSheet } from '@/lib/hooks/use-sheet';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoonGauge from '../molecules/moon-gauge';

type Field =
  'current_health' | 'current_stability' | 'current_radiance' | 'current_mai';

/** Au-delà de cette largeur, les quatre lunes tiennent sur une ligne. */
const WIDE = '@media (min-width: 520px)';

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
      '&::after': { content: '""', flex: 1, height: '1px', bgcolor: 'rule' },
    }}
  >
    {children}
  </Typography>
);

/**
 * La bande d'éphéméride : les trois Existences, puis le Maï à part, en
 * phases de lune. Collée en haut de la fiche sur tous les onglets.
 */
const EphemerisBand = ({ id }: { id: string }) => {
  const { sheet, computed, base, canEdit, update } = useSheet(id);
  const theme = useTheme();
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

  return (
    <Box
      component="section"
      aria-label="Existences et Maï"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 'appBar',
        width: '100%',
        display: 'grid',
        columnGap: 0,
        rowGap: 0.75,
        px: { xs: 1, md: 2 },
        py: { xs: 0.75, md: 1 },
        bgcolor: 'background.paper',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'rule',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gridTemplateAreas: '"ce ce ce" "g1 g2 g3" "g4 g4 g4"',
        [WIDE]: {
          gridTemplateColumns: 'repeat(3, minmax(0, 3fr)) minmax(0, 2.4fr)',
          gridTemplateAreas: '"ce ce ce cm" "g1 g2 g3 g4"',
        },
      }}
    >
      <Caption area="ce">Existences</Caption>
      <Caption area="cm" wideOnly>
        Maï
      </Caption>
      {gauges.map((g, index) => {
        const current = (sheet as FullSheet)[g.field] ?? g.max;
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
              borderColor: 'rule',
              ...(index === 3 && { pt: 0.75 }),
              [WIDE]: {
                borderLeft: index > 0 ? 1 : 0,
                borderTop: 0,
                pt: 0,
                borderColor: 'rule',
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
    </Box>
  );
};

export default EphemerisBand;
