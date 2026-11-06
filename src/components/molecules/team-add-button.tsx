'use client';

import { useState } from 'react';
import CreateTeamDialog from '../organisms/create-team-dialog';
import AddCard from './add-card';

/** La carte en pointillés à la suite des tables, comme « Nouvelle fiche ». */
const TeamAddButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddCard label="Nouvelle table de jeu" onClick={() => setOpen(true)} />
      <CreateTeamDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TeamAddButton;
