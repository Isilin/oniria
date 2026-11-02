'use client';

import { Amounts, zero } from '@/lib/rules/xp';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { AmountsFields } from './xp-dialogs';

export interface Grant extends Amounts {
  label: string;
}

/** XP de création proposée par défaut (partie normale). */
export const CREATION_XP = 700;

const today = () => new Date().toLocaleDateString('fr-FR');

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (grant: Grant) => Promise<boolean>;
  title?: string;
  /** Contenu ajouté (ex. choix des personnages d'une table). */
  children?: ReactNode;
  disabled?: boolean;
}

/** MJ : attribuer de l'XP (ou en retirer, avec des montants négatifs). */
const XpGrantDialog = ({
  open,
  onClose,
  onSubmit,
  title = "Attribuer de l'expérience",
  children,
  disabled,
}: Props) => {
  const [label, setLabel] = useState(`Session du ${today()}`);
  const [amounts, setAmounts] = useState<Amounts>(zero());
  const [loading, setLoading] = useState(false);
  const empty = !amounts.feel && !amounts.learn && !amounts.live;

  const submit = async () => {
    setLoading(true);
    const ok = await onSubmit({ label, ...amounts });
    setLoading(false);
    if (ok) {
      setAmounts(zero());
      setLabel(`Session du ${today()}`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          Un montant négatif retire de l&apos;XP.
        </DialogContentText>
        <Box sx={{ display: 'flex', gap: 1, my: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Création : ${CREATION_XP} Vivre`}
            onClick={() => {
              setLabel('Création');
              setAmounts({ feel: 0, learn: 0, live: CREATION_XP });
            }}
          />
        </Box>
        <TextField
          label="Libellé"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
          size="small"
          margin="dense"
        />
        <AmountsFields value={amounts} onChange={setAmounts} allowNegative />
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={loading || empty || disabled}
        >
          {loading ? <CircularProgress size={20} /> : 'Attribuer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default XpGrantDialog;
