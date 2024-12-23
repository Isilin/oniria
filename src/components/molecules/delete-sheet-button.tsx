'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import IconAction from '../atoms/icon-action';
import DeleteConfirmation from './_shared/delete-confirmation';

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
      <IconAction icon={DeleteIcon} onClick={() => setOpen(true)} />
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={handleClick}
      />
    </>
  );
};

export default DeleteSheetButton;
