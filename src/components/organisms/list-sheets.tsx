'use client';

import { useSheets } from '@/lib/hooks/use-sheet';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import LoadError from '../atoms/load-error';
import { Armillary } from '../atoms/ornaments';
import AddSheetCard from '../molecules/add-sheet-card';
import SheetCard from '../molecules/sheet-card';

/** Titre de liste, comme un titre de section de la feuille. */
const HEADING = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  mb: 2,
  '&::after': {
    content: '""',
    flex: 1,
    height: '1px',
    bgcolor: 'text.primary',
  },
};

const ListSheets = () => {
  const { sheets, error, isLoading, retry } = useSheets();

  // Sans liste (lecture en échec), l'accueil le dit au lieu de tomber.
  if (!sheets) {
    return isLoading || !error ? (
      <CircularProgress />
    ) : (
      <LoadError
        what="Les fiches n'ont pas pu être lues."
        error={error}
        onRetry={retry}
      />
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h2" sx={HEADING}>
        <Armillary />
        Mes fiches
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{
          gap: 4,
        }}
      >
        {sheets.own.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} userVisible={false} />
        ))}
        <AddSheetCard />
      </Grid>
      <Box sx={{ height: 32 }} />
      <Typography variant="h4" component="h2" sx={HEADING}>
        <Armillary />
        Autres fiches
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{
          gap: 4,
        }}
      >
        {sheets.others.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} userVisible={true} />
        ))}
        {sheets.others.length === 0 && (
          <Typography color="textSecondary">
            Aucune autre fiche pour l&apos;instant.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ListSheets;
