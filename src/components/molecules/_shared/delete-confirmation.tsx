'use client';

import DialogContentText from '@mui/material/DialogContentText';
import ActionDialog from './action-dialog';

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
  const remove = async () => {
    if (!waitForResult) onClose();
    try {
      await onValidated();
    } finally {
      if (waitForResult) onClose();
    }
  };

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title={title}
      confirmLabel={confirmLabel}
      confirmColor="error"
      onConfirm={remove}
    >
      <DialogContentText>{message}</DialogContentText>
    </ActionDialog>
  );
};

export default DeleteConfirmation;
