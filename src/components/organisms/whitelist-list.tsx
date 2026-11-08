'use client';

import { useWhitelist } from '@/lib/hooks/use-whitelist';
import { CircularProgress, List, Paper, Typography } from '@mui/material';
import LoadError from '../atoms/load-error';
import WhitelistElement from '../molecules/whitelist-element';

const WhitelistList = () => {
  const { whitelist, error, isLoading, retry } = useWhitelist();

  if (!whitelist) {
    // Une lecture en échec n'est pas une liste vide : « personne ne peut se
    // connecter » serait faux.
    return isLoading || !error ? (
      <CircularProgress />
    ) : (
      <LoadError
        what="La whitelist n'a pas pu être lue."
        error={error}
        onRetry={retry}
      />
    );
  }

  if (!whitelist.length) {
    return (
      <Typography color="textSecondary">
        Aucune adresse : personne ne peut se connecter avec Google.
      </Typography>
    );
  }

  return (
    <Paper sx={{ width: '100%', maxWidth: 640 }}>
      <List aria-label="Adresses autorisées à se connecter">
        {whitelist.map((element) => (
          <WhitelistElement key={element.id} element={element} />
        ))}
      </List>
    </Paper>
  );
};

export default WhitelistList;
