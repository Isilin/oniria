'use client';

import { useRangeWeapon } from '@/lib/hooks/use-range-weapons';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DeleteButton from './_shared/delete-button';

const DeleteRangeWeaponButton = ({ id }) => {
  const { id: sheetId } = useParams<{ id: string }>();
  const { deleteRangeWeapon } = useRangeWeapon(id, sheetId);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteRangeWeapon();
    enqueueSnackbar('Arme de tir supprimée.', { variant: 'info' });
  };

  return <DeleteButton onDelete={handleDelete} />;
};

export default DeleteRangeWeaponButton;
