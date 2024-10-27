'use client';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useState } from 'react';
import CreateTeamDialog from '../organisms/create-team-dialog';

const TeamAddButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} fullWidth>
        <AddIcon />
      </Button>
      <CreateTeamDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TeamAddButton;
