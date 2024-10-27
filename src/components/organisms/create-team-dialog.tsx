import { useTeams } from '@/lib/hooks/use-team';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';

const CreateTeamDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { createTeam } = useTeams();

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
          createTeam({ name: formJson.name.toString() }).then(() => {
            setLoading(false);
            onClose();
            enqueueSnackbar('Table de jeu créée.', { variant: 'info' });
          });
        },
      }}
    >
      <DialogTitle>Nouvelle table de jeu</DialogTitle>
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
          {loading ? <CircularProgress /> : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTeamDialog;
