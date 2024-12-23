import { useArmor } from '@/lib/hooks/use-armors';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import DeleteConfirmation from './_shared/delete-confirmation';

interface Props {
  armorId: string;
}

const DeleteArmorAction = ({ armorId }: Props) => {
  const { id: sheetId } = useParams<{ id: string }>();
  const { deleteArmor } = useArmor(armorId, sheetId);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    deleteArmor();
    enqueueSnackbar('Armure supprimée.', { variant: 'info' });
  };

  return (
    <>
      <GridActionsCellItem
        label="Supprimer"
        icon={<DeleteIcon />}
        onClick={() => setOpen(true)}
      />
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={handleDelete}
      />
    </>
  );
};

export default DeleteArmorAction;
