'use client';

import { useWhitelist } from '@/lib/hooks/use-whitelist';
import { CircularProgress, List, Paper, Typography } from '@mui/material';
import WhitelistElement from '../molecules/whitelist-element';

const WhitelistList = () => {
  const { whitelist, isLoading } = useWhitelist();

  if (isLoading) return <CircularProgress />;

  if (!whitelist?.length) {
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
