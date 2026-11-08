import { useNotifyError } from '@/lib/hooks/use-notify-error';
import { useSheets } from '@/lib/hooks/use-sheet';
import { STRING_MAX } from '@/lib/sheet/fields';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import ActionDialog from '../molecules/_shared/action-dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateSheetDialog = ({ open, onClose }: Props) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const notifyError = useNotifyError();
  const { createSheet } = useSheets();

  const create = async (fields?: FormData) => {
    try {
      const sheet = await createSheet(fields?.get('name')?.toString() ?? '');
      onClose();
      enqueueSnackbar('Nouvelle fiche créée.', { variant: 'info' });
      router.push(`/sheet/${sheet.id}`);
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title="Nouveau personnage"
      confirmLabel="Créer"
      onConfirm={create}
      form
    >
      <TextField
        autoFocus
        required
        margin="dense"
        id="name"
        name="name"
        slotProps={{ htmlInput: { maxLength: STRING_MAX } }}
        label="Nom"
        type="text"
        fullWidth
        variant="standard"
      />
    </ActionDialog>
  );
};

export default CreateSheetDialog;
