'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onValidated: () => void;
  /** Nomme ce qui va disparaître (« Supprimer « Lyse » ? »). */
  title?: string;
  message?: string;
  /** Libellé du bouton de confirmation (« Supprimer la fiche »). */
  confirmLabel?: string;
}

const DeleteConfirmation = ({
  open,
  onClose,
  onValidated,
  title = 'Confirmer la suppression',
  message = 'Cette action est irréversible.',
  confirmLabel = 'Supprimer',
}: Props) => {
  const handleClick = () => {
    onValidated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleClick} color="error" variant="contained">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
