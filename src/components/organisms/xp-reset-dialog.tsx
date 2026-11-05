'use client';

import { ALL_SCOPES, Scope, SCOPE_BY_KEY } from '@/lib/rules/xp';
import {
  Box,
  Checkbox,
  DialogContentText,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import ActionDialog from '../molecules/_shared/action-dialog';

const GROUPS: { label: string; scopes: Scope[] }[] = [
  { label: 'Caractéristiques', scopes: ['body', 'spirit', 'soul'] },
  { label: 'Compétences', scopes: ['general', 'spyral', 'martial'] },
  { label: 'Schémas', scopes: ['corpus', 'spyree'] },
];

interface Props {
  open: boolean;
  onClose: () => void;
  /** Parties déjà débloquées. */
  unlocked: Scope[];
  onSubmit: (scopes: Scope[]) => Promise<boolean>;
}

/** MJ : reset complet ou d'une partie de la fiche. */
const XpResetDialog = ({ open, onClose, unlocked, onSubmit }: Props) => {
  const [selected, setSelected] = useState<Scope[]>([]);
  const lockable = ALL_SCOPES.filter((s) => !unlocked.includes(s));
  const all =
    lockable.length > 0 && lockable.every((s) => selected.includes(s));

  const toggle = (scope: Scope) =>
    setSelected((current) =>
      current.includes(scope)
        ? current.filter((s) => s !== scope)
        : [...current, scope],
    );

  const submit = async () => {
    if (await onSubmit(selected)) {
      setSelected([]);
      onClose();
    }
  };

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title="Accorder un reset"
      confirmLabel="Accorder le reset"
      confirmColor="warning"
      onConfirm={submit}
      confirmDisabled={selected.length === 0}
      maxWidth="sm"
      fullWidth
    >
      <DialogContentText variant="body2" gutterBottom>
        L&apos;XP payée pour les parties choisies est rendue dans ses catégories
        et elles redeviennent modifiables librement, jusqu’à la prochaine
        validation. Ce qui avait été offert le reste.
      </DialogContentText>
      <FormControlLabel
        control={
          <Checkbox
            checked={all}
            indeterminate={!all && selected.length > 0}
            disabled={lockable.length === 0}
            onChange={() => setSelected(all ? [] : lockable)}
          />
        }
        label={<strong>Toute la fiche (reset complet)</strong>}
      />
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
          pl: 2,
        }}
      >
        {GROUPS.map((group) => (
          <FormGroup key={group.label}>
            <Typography variant="subtitle2" color="textSecondary">
              {group.label}
            </Typography>
            {group.scopes.map((scope) => (
              <FormControlLabel
                key={scope}
                control={
                  <Checkbox
                    size="small"
                    checked={
                      unlocked.includes(scope) || selected.includes(scope)
                    }
                    disabled={unlocked.includes(scope)}
                    onChange={() => toggle(scope)}
                  />
                }
                label={
                  SCOPE_BY_KEY[scope].label +
                  (unlocked.includes(scope) ? ' (déjà débloqué)' : '')
                }
              />
            ))}
          </FormGroup>
        ))}
      </Box>
    </ActionDialog>
  );
};

export default XpResetDialog;
