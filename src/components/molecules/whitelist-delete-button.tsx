'use client';

import { useWhitelistEmail } from '@/lib/hooks/use-whitelist';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import DeleteConfirmation from './_shared/delete-confirmation';

const WhitelistDeleteButton = ({ id }) => {
  const { deleteFromWhitelist } = useWhitelistEmail(id);
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = () => {
    deleteFromWhitelist(id);
    enqueueSnackbar('Suppression de la whitelist.', { variant: 'info' });
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <DeleteIcon />
      </Button>
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={handleClick}
      />
    </>
  );
};

export default WhitelistDeleteButton;
