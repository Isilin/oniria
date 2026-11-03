'use client';

import PlusIcon from '@mui/icons-material/Add';
import { Card, CardActionArea, Typography } from '@mui/material';
import { useState } from 'react';
import CreateSheetDialog from '../organisms/create-sheet-dialog';

const AddSheetCard = () => {
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
          <PlusIcon />
          <Typography variant="button">Nouvelle fiche</Typography>
        </CardActionArea>
      </Card>
      <CreateSheetDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AddSheetCard;
