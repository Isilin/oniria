'use client';

import { useState } from 'react';
import CreateSheetDialog from '../organisms/create-sheet-dialog';
import AddCard from './add-card';

const AddSheetCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddCard label="Nouvelle fiche" onClick={() => setOpen(true)} />
      <CreateSheetDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default AddSheetCard;
