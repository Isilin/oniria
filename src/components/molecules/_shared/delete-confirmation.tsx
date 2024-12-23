'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import LoadingButton from '../../atoms/loading-button';

interface Props {
  open: boolean;
  onClose: () => void;
  onValidated: () => void;
}

const DeleteConfirmation = ({ open, onClose, onValidated }: Props) => {
  const handleCancel = () => {
    onClose();
  };

  const handleClick = () => {
    onValidated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirmez-vous la suppression ? Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Annuler</Button>
        <LoadingButton onClick={handleClick}>Confirmer</LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
