'use client';

import { useGolem } from '@/lib/hooks/use-golems';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DeleteButton from './_shared/delete-button';

const DeleteGolemButton = ({ id }) => {
  const { id: sheetId } = useParams<{ id: string }>();
  const { deleteGolem } = useGolem(id, sheetId);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteGolem();
    enqueueSnackbar('Golem supprimée.', { variant: 'info' });
  };

  return <DeleteButton onDelete={handleDelete} />;
};

export default DeleteGolemButton;
