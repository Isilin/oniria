import { useTeams } from '@/lib/hooks/use-team';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';

const CreateTeamDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { createTeam } = useTeams();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get('name')?.toString() ?? '';
    setLoading(true);
    try {
      const team = await createTeam(name);
      onClose();
      enqueueSnackbar('Table de jeu créée.', { variant: 'info' });
      router.push(`/team/${team.id}`);
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
      PaperProps={{ component: 'form', onSubmit: handleSubmit }}
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
          {loading ? <CircularProgress size={20} /> : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTeamDialog;
