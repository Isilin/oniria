'use client';

import { FullSheet } from '@/lib/db/sheet';
import { useSheet } from '@/lib/hooks/use-sheet';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import SheetField from '../molecules/sheet-field';

interface Existence {
  label: string;
  field: 'current_health' | 'current_stability' | 'current_radiance';
  max: number;
  threshold: number;
  maxHint: string;
  thresholdHint: string;
  color: 'error' | 'info' | 'warning';
}

const ExistencesCard = ({ id }: { id: string }) => {
  const { sheet, computed, canEdit, update } = useSheet(id);

  const existences: Existence[] = [
    {
      label: 'La Santé',
      field: 'current_health',
      max: computed.health,
      threshold: computed.healthThreshold,
      maxHint: 'Vigueur / 10, plus les bonus « Santé +N » du Corpus',
      thresholdHint: 'Vigueur / 5',
      color: 'error',
    },
    {
      label: "L'Équilibre",
      field: 'current_stability',
      max: computed.stability,
      threshold: computed.stabilityThreshold,
      maxHint: 'Entendement / 10',
      thresholdHint: 'Entendement / 5',
      color: 'info',
    },
    {
      label: "L'Éclat",
      field: 'current_radiance',
      max: computed.radiance,
      threshold: computed.radianceThreshold,
      maxHint: 'Âme / 10',
      thresholdHint: 'Âme / 5',
      color: 'warning',
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Existences
        </Typography>
        <Grid
          display="flex"
          justifyContent="space-evenly"
          gap={4}
          flexWrap="wrap"
        >
          {existences.map((e) => {
            const current = (sheet as FullSheet)[e.field] ?? e.max;
            return (
              <Grid key={e.field} minWidth={140}>
                <SheetField
                  label={e.label}
                  value={current}
                  tooltip={`Maximum : ${e.maxHint}`}
                  editable={canEdit}
                  onEdit={(newVal) =>
                    update({ [e.field]: newVal === '' ? null : Number(newVal) })
                  }
                  postValue={`/ ${e.max}`}
                />
                <LinearProgress
                  variant="determinate"
                  color={e.color}
                  value={
                    e.max > 0
                      ? Math.max(0, Math.min(100, (current / e.max) * 100))
                      : 0
                  }
                  sx={{ my: 0.5 }}
                />
                <SheetField
                  label="Seuil"
                  value={e.threshold}
                  tooltip={e.thresholdHint}
                />
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExistencesCard;
