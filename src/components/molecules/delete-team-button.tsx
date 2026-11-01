'use client';

import { useTeam } from '@/lib/hooks/use-team';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import DeleteConfirmation from './_shared/delete-confirmation';

const DeleteTeamButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { deleteTeam } = useTeam(id);
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    if (await deleteTeam()) {
      await mutate('/api/teams');
      router.push('/team');
    }
  };

  return (
    <>
      <Button
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => setOpen(true)}
      >
        Supprimer la table
      </Button>
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={handleClick}
        message="Supprimer cette table de jeu ? Les fiches des personnages sont conservées."
      />
    </>
  );
};

export default DeleteTeamButton;
