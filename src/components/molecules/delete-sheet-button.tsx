'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteConfirmation from './delete-confirmation';

const DeleteSheetButton = ({ id }) => {
  const router = useRouter();
  const handleClick = () => {
    fetch(`/api/sheet/${id}`, { method: 'DELETE' });
    router.push('/');
    router.refresh();
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

export default DeleteSheetButton;
