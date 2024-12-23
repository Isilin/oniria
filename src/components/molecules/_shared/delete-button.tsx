'use client';

import IconAction from '@/components/atoms/icon-action';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import DeleteConfirmation from './delete-confirmation';

interface Props {
  onDelete: () => void;
}

const DeleteButton = ({ onDelete }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconAction icon={DeleteIcon} onClick={() => setOpen(true)} />
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={onDelete}
      />
    </>
  );
};

export default DeleteButton;
