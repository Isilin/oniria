'use client';

import { useSheets } from '@/lib/hooks/use-sheet';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import CardRow from '../atoms/card-row';
import LoadError from '../atoms/load-error';
import SectionHeading from '../atoms/section-heading';
import AddSheetCard from '../molecules/add-sheet-card';
import SheetCard from '../molecules/sheet-card';

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
      <SectionHeading sx={{ mb: 2 }}>Mes fiches</SectionHeading>
      <CardRow>
        {sheets.own.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} userVisible={false} />
        ))}
        <AddSheetCard />
      </CardRow>
      <Box sx={{ height: 32 }} />
      <SectionHeading sx={{ mb: 2 }}>Autres fiches</SectionHeading>
      <CardRow>
        {sheets.others.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} userVisible={true} />
        ))}
        {sheets.others.length === 0 && (
          <Typography color="textSecondary">
            Aucune autre fiche pour l&apos;instant.
          </Typography>
        )}
      </CardRow>
    </Container>
  );
};

export default ListSheets;
