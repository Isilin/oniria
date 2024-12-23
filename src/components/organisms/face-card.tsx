'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import CustomCard from '../atoms/custom-card';
import SheetField from '../molecules/sheet-field';

const FaceCard = ({ id }) => {
  const { sheet, mutate } = useSheet(id);

  return (
    <CustomCard name="Visage">
      <Grid display="flex" flexDirection="column">
        <Typography variant="h5">Le Soi</Typography>
        <SheetField
          label="Âge"
          value={sheet.age ? `${sheet.age}` : '?'}
          postValue="ans"
          onEdit={(newVal) => {
            mutate({ age: Number(newVal) });
          }}
        />
        <Typography variant="h5">L&apos;Autre</Typography>
        <SheetField
          label="Maï"
          value={sheet.current_mai}
          postValue={`/ ${sheet.mai}`}
          onEdit={(newVal) => {
            mutate({ current_mai: Number(newVal) });
          }}
        />
        <Typography variant="h5">Le Monde</Typography>
        <SheetField
          label="Aspect"
          value={sheet.aspect}
          onEdit={(newVal) => {
            mutate({ aspect: String(newVal) });
          }}
        />
        <SheetField
          label="Devenir"
          value={sheet.become}
          onEdit={(newVal) => {
            mutate({ become: String(newVal) });
          }}
        />
      </Grid>
    </CustomCard>
  );
};

export default FaceCard;
