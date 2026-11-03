'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import DeleteConfirmation from './_shared/delete-confirmation';
import MoreActions from './_shared/more-actions';

const DeleteSheetButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { sheet, canEdit, deleteSheet } = useSheet(id);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  if (!canEdit) return null;

  const name = sheet?.name || 'cette fiche';

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
      <MoreActions
        label="Actions sur la fiche"
        actions={[
          {
            label: 'Supprimer la fiche…',
            icon: <DeleteIcon fontSize="small" />,
            danger: true,
            onClick: () => setOpen(true),
          },
        ]}
      />
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={handleClick}
        title={`Supprimer « ${name} » ?`}
        message="La fiche disparaît avec son inventaire, ses notes et tout son historique d'expérience. Cette action est irréversible."
        confirmLabel="Supprimer la fiche"
      />
    </>
  );
};

export default DeleteSheetButton;
