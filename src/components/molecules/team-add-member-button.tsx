'use client';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useState } from 'react';

const TeamAddMemberButton = (/*{ id }*/) => {
  const [, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} fullWidth>
        <AddIcon />
      </Button>
    </>
  );
};

export default TeamAddMemberButton;
