'use client';

import { useTeam } from '@/lib/hooks/use-team';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteConfirmation from './delete-confirmation';

const DeleteTeamButton = ({ id }) => {
  const router = useRouter();
  const { deleteTeam } = useTeam(id);
  const handleClick = () => {
    deleteTeam();
    router.push('/team');
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

export default DeleteTeamButton;
