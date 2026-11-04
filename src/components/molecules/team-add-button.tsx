'use client';

import AddIcon from '@mui/icons-material/Add';
import { Card, CardActionArea, Typography } from '@mui/material';
import { useState } from 'react';
import CreateTeamDialog from '../organisms/create-team-dialog';

/** Une carte en pointillés à la suite des tables, comme « Nouvelle fiche ». */
const TeamAddButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        sx={{
          width: 250,
          borderStyle: 'dashed',
          bgcolor: 'transparent',
        }}
      >
        <CardActionArea
          onClick={() => setOpen(true)}
          sx={{
            height: '100%',
            minHeight: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: 'primary.main',
          }}
        >
          <AddIcon />
          <Typography variant="button">Nouvelle table de jeu</Typography>
        </CardActionArea>
      </Card>
      <CreateTeamDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TeamAddButton;
