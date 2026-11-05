import { useNotifyError } from '@/lib/hooks/use-notify-error';
import { useTeams } from '@/lib/hooks/use-team';
import { STRING_MAX } from '@/lib/sheet/fields';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { SyntheticEvent, useState } from 'react';
import BusyButton from '../atoms/busy-button';

const CreateTeamDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const notifyError = useNotifyError();
  const { createTeam } = useTeams();

  const handleSubmit = async (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    const name =
      new FormData(e.currentTarget as HTMLFormElement)
        .get('name')
        ?.toString() ?? '';
    setLoading(true);
    try {
      const team = await createTeam(name);
      onClose();
      enqueueSnackbar('Table de jeu créée.', { variant: 'info' });
      router.push(`/team/${team.id}`);
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
      <DialogTitle>Nouvelle table de jeu</DialogTitle>
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
          Ajouter
        </BusyButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTeamDialog;
