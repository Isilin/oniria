import { useWhitelist } from '@/lib/hooks/use-whitelist';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';

const CreateWhitelistDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { addToWhitelist } = useWhitelist();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          setLoading(true);
          addToWhitelist({ email: formJson.email.toString() }).then(() => {
            setLoading(false);
            onClose();
            enqueueSnackbar('Ajout à la whitelist.', { variant: 'info' });
          });
        },
      }}
    >
      <DialogTitle>Nouvel email</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <CircularProgress /> : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWhitelistDialog;
