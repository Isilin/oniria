'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import DeleteConfirmation from './_shared/delete-confirmation';

const DeleteSheetButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { sheet, canEdit, deleteSheet } = useSheet(id);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  if (!canEdit) return null;

  const handleClick = async () => {
    if (await deleteSheet()) {
      enqueueSnackbar(`${sheet?.name ?? 'Fiche'} supprimée.`, {
        variant: 'info',
      });
      await mutate('/api/sheets');
      router.push('/');
    }
  };

  return (
    <>
      <Button
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => setOpen(true)}
      >
        Supprimer
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
