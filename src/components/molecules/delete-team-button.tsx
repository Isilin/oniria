'use client';

import { useTeam } from '@/lib/hooks/use-team';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import DeleteConfirmation from './_shared/delete-confirmation';
import MoreActions from './_shared/more-actions';

const DeleteTeamButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { team, deleteTeam } = useTeam(id);
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    if (await deleteTeam()) {
      await mutate('/api/teams');
      router.push('/team');
    }
  };

  return (
    <>
      <MoreActions
        label="Actions sur la table"
        actions={[
          {
            label: 'Supprimer la table…',
            icon: <DeleteIcon fontSize="small" />,
            danger: true,
            onClick: () => setOpen(true),
          },
        ]}
      />
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={handleClick}
        title={`Supprimer la table « ${team?.name ?? ''} » ?`}
        message="Les fiches des personnages sont conservées ; seule la table disparaît."
        confirmLabel="Supprimer la table"
        waitForResult
      />
    </>
  );
};

export default DeleteTeamButton;
