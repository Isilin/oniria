import { useNotifyError } from '@/lib/hooks/use-notify-error';
import { useTeams } from '@/lib/hooks/use-team';
import { STRING_MAX } from '@/lib/sheet/fields';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import ActionDialog from '../molecules/_shared/action-dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateTeamDialog = ({ open, onClose }: Props) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const notifyError = useNotifyError();
  const { createTeam } = useTeams();

  const create = async (fields?: FormData) => {
    try {
      const team = await createTeam(fields?.get('name')?.toString() ?? '');
      onClose();
      enqueueSnackbar('Table de jeu créée.', { variant: 'info' });
      router.push(`/team/${team.id}`);
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title="Nouvelle table de jeu"
      confirmLabel="Ajouter"
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

export default CreateTeamDialog;
