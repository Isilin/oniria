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

interface Props {
  open: boolean;
  onClose: () => void;
  onValidated: () => unknown;
  /** Nomme ce qui va disparaître (« Supprimer « Lyse » ? »). */
  title?: string;
  message?: string;
  /** Libellé du bouton de confirmation (« Supprimer la fiche »). */
  confirmLabel?: string;
  /**
   * Garde la boîte ouverte jusqu'à la fin de la suppression (une fiche, une
   * table) : on voit que ça travaille. Sinon elle se ferme tout de suite et
   * la suppression s'affiche aussitôt (retraits optimistes).
   */
  waitForResult?: boolean;
}

const DeleteConfirmation = ({
  open,
  onClose,
  onValidated,
  title = 'Confirmer la suppression',
  message = 'Cette action est irréversible.',
  confirmLabel = 'Supprimer',
  waitForResult = false,
}: Props) => {
  // Un double clic ne supprime qu'une fois.
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    if (!waitForResult) onClose();
    try {
      await onValidated();
    } finally {
      setBusy(false);
      if (waitForResult) onClose();
    }
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Annuler
        </Button>
        <Button
          onClick={handleClick}
          color="error"
          variant="contained"
          disabled={busy}
        >
          {busy && waitForResult ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            confirmLabel
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
