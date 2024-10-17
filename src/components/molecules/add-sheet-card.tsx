'use client';

import PlusICon from '@mui/icons-material/Add';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { useState } from 'react';
import CreateSheetDialog from '../organisms/create-sheet-dialog';

const AddSheetCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card sx={{ width: 250 }}>
        <CardActionArea sx={{ height: '100%' }} onClick={() => setOpen(true)}>
          <CardContent
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusICon sx={{ width: 100, height: 100 }} />
          </CardContent>
        </CardActionArea>
      </Card>
      <CreateSheetDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AddSheetCard;
