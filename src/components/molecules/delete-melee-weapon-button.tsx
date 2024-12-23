'use client';

import { useMeleeWeapon } from '@/lib/hooks/use-melee-weapons';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import DeleteButton from './_shared/delete-button';

const DeleteMeleeWeaponButton = ({ id }) => {
  const { id: sheetId } = useParams<{ id: string }>();
  const { deleteMeleeWeapon } = useMeleeWeapon(id, sheetId);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteMeleeWeapon();
    enqueueSnackbar('Arme de mêlée supprimée.', { variant: 'info' });
  };

  return <DeleteButton onDelete={handleDelete} />;
};

export default DeleteMeleeWeaponButton;
