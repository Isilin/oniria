'use client';

import { useWhitelist } from '@/lib/hooks/use-whitelist';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { SyntheticEvent, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Ajout d'une adresse : le dialogue reste ouvert tant que le serveur refuse. */
const CreateWhitelistDialog = ({ open, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const { addToWhitelist } = useWhitelist();

  const submit = async (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    setLoading(true);
    const ok = await addToWhitelist(String(formData.get('email') ?? ''));
    setLoading(false);
    if (ok) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { component: 'form', onSubmit: submit } }}
    >
      <DialogTitle>Autoriser une adresse</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          La personne pourra se connecter avec le compte Google de cette
          adresse.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Adresse email"
          type="email"
          slotProps={{ htmlInput: { maxLength: 254 } }}
          autoComplete="off"
          fullWidth
          variant="standard"
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWhitelistDialog;
