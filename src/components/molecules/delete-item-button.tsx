'use client';

import { useItem } from '@/lib/hooks/use-items';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DeleteButton from './_shared/delete-button';

const DeleteItemButton = ({ id }) => {
  const { id: sheetId } = useParams<{ id: string }>();
  const { deleteItem } = useItem(id, sheetId);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteItem();
    enqueueSnackbar('Objet supprimé.', { variant: 'info' });
  };

  return <DeleteButton onDelete={handleDelete} />;
};

export default DeleteItemButton;
