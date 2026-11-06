'use client';

import { useWhitelist } from '@/lib/hooks/use-whitelist';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import ActionDialog from '../molecules/_shared/action-dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Ajout d'une adresse : le dialogue reste ouvert tant que le serveur refuse. */
const CreateWhitelistDialog = ({ open, onClose }: Props) => {
  const { addToWhitelist } = useWhitelist();

  const add = async (fields?: FormData) => {
    if (await addToWhitelist(String(fields?.get('email') ?? ''))) onClose();
  };

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title="Autoriser une adresse"
      confirmLabel="Ajouter"
      onConfirm={add}
      form
    >
      <DialogContentText variant="body2">
        La personne pourra se connecter avec le compte Google de cette adresse.
      </DialogContentText>
      <TextField
        autoFocus
        required
        margin="dense"
        id="email"
        name="email"
        label="Adresse email"
        type="email"
        slotProps={{ htmlInput: { maxLength: 254 } }}
        autoComplete="off"
        fullWidth
        variant="standard"
      />
    </ActionDialog>
  );
};

export default CreateWhitelistDialog;
