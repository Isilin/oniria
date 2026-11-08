'use client';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useState } from 'react';
import CreateWhitelistDialog from '../organisms/create-whitelist-dialog';

const WhitelistAddButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Ajouter une adresse
      </Button>
      <CreateWhitelistDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default WhitelistAddButton;
