import { useTeamMembers } from '@/lib/hooks/use-team';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import DeleteConfirmation from './delete-confirmation';

const TeamMemberDeleteButton = ({ id }) => {
  const { id: teamId } = useParams<{ id: string }>();
  const { deleteFromTeam } = useTeamMembers(teamId, id);
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = () => {
    deleteFromTeam(id);
    enqueueSnackbar('Personnage retiré de la table.', { variant: 'info' });
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <DeleteIcon />
      </Button>
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={handleClick}
      />
    </>
  );
};

export default TeamMemberDeleteButton;
