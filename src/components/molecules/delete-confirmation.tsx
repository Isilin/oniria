'use client';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';

const DeleteConfirmation = ({ open, onClose, onValidated }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    onValidated();
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Voulez-vous vraiment supprimer cette fiche de personnage ? Cette
          action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClick}>
          {loading ? <CircularProgress /> : 'Confirmer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
