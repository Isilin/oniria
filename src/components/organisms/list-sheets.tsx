'use client';

import { useSheets } from '@/lib/hooks/use-sheet';
import {
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddSheetCard from '../molecules/add-sheet-card';
import SheetCard from '../molecules/sheet-card';

const ListSheets = () => {
  const { sheets, isLoading } = useSheets();

  if (isLoading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4">Mes fiches</Typography>
      <Grid container spacing={2} columns={12} gap={4}>
        {[...sheets.own].map((sheet, index) => (
          <SheetCard key={index} sheet={sheet} userVisible={false} />
        ))}
        <AddSheetCard />
      </Grid>
      <Divider sx={{ my: 2 }} variant="middle" />
      <Typography variant="h4">Autres fiches</Typography>
      <Grid container spacing={2} columns={12} gap={4}>
        {[...sheets.others].map((sheet, index) => (
          <SheetCard key={index} sheet={sheet} userVisible={true} />
        ))}
      </Grid>
    </Container>
  );
};

export default ListSheets;
