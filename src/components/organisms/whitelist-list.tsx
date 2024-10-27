'use client';

import { useWhitelist } from '@/lib/hooks/use-whitelist';
import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import WhitelistElement from '../molecules/whitelist-element';

const WhitelistList = () => {
  const { whitelist, isLoading } = useWhitelist();

  if (isLoading) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {whitelist.map((element) => (
        <WhitelistElement key={element.id} element={element} />
      ))}
    </Grid>
  );
};

export default WhitelistList;
