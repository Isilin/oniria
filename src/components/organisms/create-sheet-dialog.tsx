import { useNotifyError } from '@/lib/hooks/use-notify-error';
import { useSheets } from '@/lib/hooks/use-sheet';
import { STRING_MAX } from '@/lib/sheet/fields';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { SyntheticEvent, useState } from 'react';
import BusyButton from '../atoms/busy-button';

const CreateSheetDialog = ({ open, onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const notifyError = useNotifyError();
  const { createSheet } = useSheets();

  const handleSubmit = async (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    const name =
      new FormData(e.currentTarget as HTMLFormElement)
        .get('name')
        ?.toString() ?? '';
    setLoading(true);
    try {
      const sheet = await createSheet(name);
      onClose();
      enqueueSnackbar('Nouvelle fiche créée.', { variant: 'info' });
      router.push(`/sheet/${sheet.id}`);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { component: 'form', onSubmit: handleSubmit },
      }}
    >
      <DialogTitle>Nouveau personnage</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <BusyButton type="submit" busy={loading}>
          Créer
        </BusyButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSheetDialog;
