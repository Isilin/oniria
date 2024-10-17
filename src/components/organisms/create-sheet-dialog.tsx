import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const CreateSheetDialog = ({ open, onClose }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
          const sheet = await fetch('/api/sheet', {
            method: 'POST',
            body: JSON.stringify({
              userId: session?.user.id,
              name: formJson.name.toString(),
            }),
          }).then((res) => res.json());
          setLoading(false);
          onClose();
          router.push(`/sheet/${sheet.id}`);
        },
      }}
    >
      <DialogTitle>Nouveau personnage</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
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
