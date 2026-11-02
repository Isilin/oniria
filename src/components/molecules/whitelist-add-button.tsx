'use client';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useState } from 'react';
import CreateWhitelistDialog from '../organisms/create-whitelist-dialog';

const WhitelistAddButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        fullWidth
        aria-label="Ajouter un email"
      >
        <AddIcon />
      </Button>
      <CreateWhitelistDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default WhitelistAddButton;
