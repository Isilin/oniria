'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import Grid from '@mui/material/Grid2';
import CustomCard from '../atoms/custom-card';
import SheetField from '../molecules/sheet-field';

const ExistencesCard = ({ id }) => {
  const { sheet, mutate } = useSheet(id);

  return (
    <CustomCard name="Existences">
      <Grid display="flex" justifyContent="space-evenly" gap={4}>
        <Grid>
          <SheetField
            label="La Santé"
            value={sheet.current_health}
            tooltip="Santé max : Vigueur / 10"
            onEdit={(newVal) => {
              mutate({ current_health: Number(newVal) });
            }}
            postValue={`/ ${sheet.health}`}
          />
          <SheetField
            label="Seuil"
            value={sheet.healthThreshold}
            tooltip="Seuil : Vigueur / 5"
          />
        </Grid>
        <Grid>
          <SheetField
            label="L'Équilibre"
            value={sheet.current_stability}
            tooltip="Équilibre max : Entendement / 10"
            onEdit={(newVal) => {
              mutate({ current_stability: Number(newVal) });
            }}
            postValue={`/ ${sheet.stability}`}
          />
          <SheetField
            label="Seuil"
            value={sheet.stabilityThreshold}
            tooltip="Seuil : Entendement / 5"
          />
        </Grid>
        <Grid>
          <SheetField
            label="L'Éclat"
            value={sheet.current_radiance}
            tooltip="Éclat max : Âme / 10"
            onEdit={(newVal) => {
              mutate({ current_radiance: Number(newVal) });
            }}
            postValue={`/ ${sheet.radiance}`}
          />
          <SheetField
            label="Seuil"
            value={sheet.radianceThreshold}
            tooltip="Seuil : Âme / 5"
          />
        </Grid>
      </Grid>
    </CustomCard>
  );
};

export default ExistencesCard;
