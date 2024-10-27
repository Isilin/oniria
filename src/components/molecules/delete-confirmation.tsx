'use client';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import LoadingButton from '../atoms/loading-button';

const DeleteConfirmation = ({ open, onClose, onValidated }) => {
  const handleClick = () => {
    onValidated();
    onClose();
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
        <LoadingButton onClick={handleClick}>Confirmer</LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
