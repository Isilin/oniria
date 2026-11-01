import { useSheets } from '@/lib/hooks/use-sheet';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { SyntheticEvent, useState } from 'react';

const CreateSheetDialog = ({ open, onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
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
      enqueueSnackbar((error as Error).message, { variant: 'error' });
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
        <Button type="submit" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSheetDialog;
