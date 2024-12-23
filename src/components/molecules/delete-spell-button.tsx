'use client';

import { useSpell } from '@/lib/hooks/use-spells';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DeleteButton from './_shared/delete-button';

const DeleteSpellButton = ({ id }) => {
  const { id: sheetId } = useParams<{ id: string }>();
  const { deleteSpell } = useSpell(id, sheetId);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteSpell();
    enqueueSnackbar('Sortilège supprimé.', { variant: 'info' });
  };

  return <DeleteButton onDelete={handleDelete} />;
};

export default DeleteSpellButton;
