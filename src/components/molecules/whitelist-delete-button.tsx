'use client';

import { useWhitelist } from '@/lib/hooks/use-whitelist';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { Whitelist } from '@prisma/client';
import { useState } from 'react';
import DeleteConfirmation from './_shared/delete-confirmation';

const WhitelistDeleteButton = ({ element }: { element: Whitelist }) => {
  const { deleteFromWhitelist } = useWhitelist();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Retirer">
        <IconButton
          aria-label={`Retirer ${element.email}`}
          onClick={() => setOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <DeleteConfirmation
        open={open}
        onClose={() => setOpen(false)}
        onValidated={() => deleteFromWhitelist(element)}
        title={`Retirer ${element.email} ?`}
        message="Cette personne ne pourra plus se connecter. Ses fiches sont conservées."
        confirmLabel="Retirer"
      />
    </>
  );
};

export default WhitelistDeleteButton;
