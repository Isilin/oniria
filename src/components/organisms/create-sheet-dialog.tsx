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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';

const CreateSheetDialog = ({ open, onClose }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { createSheet } = useSheets();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          setLoading(true);
          createSheet({
            userId: session?.user.id,
            name: formJson.name.toString(),
          }).then(async (res) => {
            const sheet = await res.json();

            setLoading(false);
            onClose();
            enqueueSnackbar('Nouvelle fiche créée.', { variant: 'info' });
            router.push(`/sheet/${sheet.id}`);
          });
        },
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
          {loading ? <CircularProgress /> : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSheetDialog;
