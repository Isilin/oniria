'use client';

import { useWhitelist } from '@/lib/hooks/use-whitelist';
import EditIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Whitelist } from '@prisma/client';
import { FormEvent, useState } from 'react';
import WhitelistDeleteButton from './whitelist-delete-button';

/**
 * Une adresse de la whitelist : affichée en entier, en lecture seule ;
 * la correction passe par « Modifier », Entrée enregistre, Échap annule.
 */
const WhitelistElement = ({ element }: { element: Whitelist }) => {
  const { updateEmail } = useWhitelist();
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const email = element.email ?? '';

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (draft === null) return;
    if (draft.trim().toLowerCase() === email) {
      setDraft(null);
      return;
    }
    setSaving(true);
    const ok = await updateEmail(element.id, draft);
    setSaving(false);
    if (ok) setDraft(null);
  };

  if (draft !== null) {
    return (
      <ListItem>
        <Box
          component="form"
          onSubmit={save}
          sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}
        >
          <TextField
            autoFocus
            label="Adresse"
            type="email"
            slotProps={{ htmlInput: { maxLength: 254 } }}
            size="small"
            fullWidth
            value={draft}
            disabled={saving}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setDraft(null)}
          />
          <Button onClick={() => setDraft(null)} disabled={saving}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            Enregistrer
          </Button>
        </Box>
      </ListItem>
    );
  }

  return (
    <ListItem
      secondaryAction={
        <>
          <Tooltip title="Modifier">
            <IconButton
              aria-label={`Modifier ${email}`}
              onClick={() => setDraft(email)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <WhitelistDeleteButton element={element} />
        </>
      }
      sx={{ pr: 13 }}
    >
      <Typography sx={{ overflowWrap: 'anywhere' }}>{email}</Typography>
    </ListItem>
  );
};

export default WhitelistElement;
