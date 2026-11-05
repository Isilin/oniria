'use client';

import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ReactNode, SyntheticEvent, useState } from 'react';
import BusyButton from '../../atoms/busy-button';

interface Props {
  open: boolean;
  /** « Annuler », Échap ou un clic à côté (bloqués pendant l'envoi). */
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  /** Le bouton dit ce qu'il fait (« Créer », « Supprimer la fiche »). */
  confirmLabel: ReactNode;
  /**
   * L'action. Tant que sa promesse court, le bouton est occupé, les champs
   * ne bougent plus et le dialogue ne se ferme pas. Le fermer ensuite
   * revient à l'appelant, en cas de succès seulement : un refus du serveur
   * laisse corriger et réessayer. En formulaire, elle reçoit les champs.
   */
  onConfirm: (fields?: FormData) => unknown;
  /** `error` pour supprimer, `warning` pour reprendre ou accorder un reset. */
  confirmColor?: ButtonProps['color'];
  /** L'action n'est pas encore possible (montant vide, répartition fausse). */
  confirmDisabled?: boolean;
  /** Un formulaire : Entrée valide, et les champs `required` sont vérifiés. */
  form?: boolean;
  maxWidth?: DialogProps['maxWidth'];
  fullWidth?: boolean;
}

/**
 * Un dialogue posé sur la feuille, qui se termine par « Annuler » et une
 * action à l'encre bleue (ou sanguine, ou d'alerte). Il attend la fin de
 * l'action : un double clic, ou Entrée deux fois, n'envoie qu'une fois.
 */
const ActionDialog = ({
  open,
  onClose,
  title,
  children,
  confirmLabel,
  onConfirm,
  confirmColor = 'primary',
  confirmDisabled = false,
  form = false,
  maxWidth,
  fullWidth,
}: Props) => {
  const [pending, setPending] = useState(false);

  const confirm = async (fields?: FormData) => {
    if (pending) return;
    setPending(true);
    try {
      await onConfirm(fields);
    } finally {
      setPending(false);
    }
  };

  const submit = (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    void confirm(new FormData(e.currentTarget as HTMLFormElement));
  };

  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={
        form ? { paper: { component: 'form', onSubmit: submit } } : undefined
      }
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* Pendant l'envoi, les champs ne changent plus ce qui part ; ils
            gardent leur encre, comme le bouton occupé. */}
        <Box
          component="fieldset"
          disabled={pending}
          sx={{ m: 0, p: 0, border: 0, minWidth: 0 }}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>
          Annuler
        </Button>
        <BusyButton
          type={form ? 'submit' : 'button'}
          variant="contained"
          color={confirmColor}
          onClick={form ? undefined : () => void confirm()}
          // Le dialogue qui attend montre la roue ; celui qui se ferme déjà
          // (retrait optimiste) reste seulement bloqué.
          busy={pending && open}
          disabled={pending || confirmDisabled}
        >
          {confirmLabel}
        </BusyButton>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
