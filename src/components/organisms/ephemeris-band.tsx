'use client';

import { FullSheet } from '@/lib/db/sheet';
import { useSheet } from '@/lib/hooks/use-sheet';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoonGauge from '../molecules/moon-gauge';

type Field =
  'current_health' | 'current_stability' | 'current_radiance' | 'current_mai';

/**
 * La bande d'éphéméride : les Existences et le Maï en phases de lune,
 * collée en haut de la fiche sur tous les onglets, modifiables en un geste.
 */
const EphemerisBand = ({ id }: { id: string }) => {
  const { sheet, computed, canEdit, update } = useSheet(id);
  const theme = useTheme();
  if (!sheet || !computed) return null;
  const colors = theme.vars!.palette.existence;

  const gauges: {
    label: string;
    field: Field;
    max: number;
    threshold?: number;
    hint: string;
    color: string;
  }[] = [
    {
      label: 'La Santé',
      field: 'current_health',
      max: computed.health,
      threshold: computed.healthThreshold,
      hint: 'Vigueur / 10, plus les bonus « Santé +N » du Corpus',
      color: colors.health,
    },
    {
      label: "L'Équilibre",
      field: 'current_stability',
      max: computed.stability,
      threshold: computed.stabilityThreshold,
      hint: 'Entendement / 10',
      color: colors.stability,
    },
    {
      label: "L'Éclat",
      field: 'current_radiance',
      max: computed.radiance,
      threshold: computed.radianceThreshold,
      hint: 'Âme / 10',
      color: colors.radiance,
    },
    {
      label: 'Maï',
      field: 'current_mai',
      max: computed.mai,
      hint: 'Âme / 10',
      color: colors.mai,
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
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(4, minmax(0, 1fr))',
        },
        gap: { xs: 1, md: 2 },
        px: { xs: 1, md: 2.5 },
        py: { xs: 0.75, md: 1.25 },
        bgcolor: 'background.default',
        borderBottom: 1,
        borderColor: 'rule',
      }}
    >
      {gauges.map((g) => {
        const current = (sheet as FullSheet)[g.field] ?? g.max;
        return (
          <MoonGauge
            key={g.field}
            label={g.label}
            current={current}
            max={g.max}
            threshold={g.threshold}
            hint={g.hint}
            color={g.color}
            editable={canEdit}
            onChange={(value) => update({ [g.field]: value })}
          />
        );
      })}
    </Box>
  );
};

export default EphemerisBand;
