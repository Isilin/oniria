'use client';

import EditIcon from '@mui/icons-material/Edit';
import { TextField, Typography } from '@mui/material';
import { KeyboardEvent, useState } from 'react';

export type EditableValue = string | number | null | undefined;

interface Props {
  value: EditableValue;
  onChange?: (value: string) => void;
  type?: 'text' | 'number' | 'multiline';
  placeholder?: string;
  /** Si faux, la valeur est affichée en lecture seule. */
  editable?: boolean;
  /** Affichage (ex. chiffres romains) quand le champ n'est pas en édition. */
  display?: string;
  minWidth?: number;
  fullWidth?: boolean;
  'aria-label'?: string;
}

const EditableField = ({
  value,
  onChange,
  type = 'text',
  placeholder = '-',
  editable = true,
  display,
  minWidth,
  fullWidth,
  'aria-label': ariaLabel,
}: Props) => {
  const asString = value === null || value === undefined ? '' : `${value}`;
  // Brouillon pendant l'édition ; null = on affiche la valeur reçue, qui
  // reste donc à jour si elle change ailleurs (recalcul, autre onglet…).
  const [draft, setDraft] = useState<string | null>(null);
  const focused = draft !== null;
  const currentValue = draft ?? asString;
  const setFocused = (on: boolean) => setDraft(on ? asString : null);
  const setCurrentValue = setDraft;

  const commit = () => {
    if (draft !== null && draft !== asString) onChange?.(draft);
    setDraft(null);
  };

  const cancel = () => setDraft(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') cancel();
    if (e.key === 'Enter' && (type !== 'multiline' || e.ctrlKey)) commit();
  };

  const shown = display ?? (asString || placeholder);

  if (!editable) {
    return (
      <Typography
        variant="body1"
        component="span"
        sx={{ whiteSpace: type === 'multiline' ? 'pre-line' : undefined }}
      >
        {shown}
      </Typography>
    );
  }

  if (!focused) {
    return (
      <Typography
        variant="body1"
        component="span"
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onClick={() => setFocused(true)}
        onFocus={() => setFocused(true)}
        color={asString ? 'textPrimary' : 'textSecondary'}
        sx={{
          cursor: 'pointer',
          borderBottom: '1px dashed transparent',
          whiteSpace: type === 'multiline' ? 'pre-line' : undefined,
          ':hover': { borderBottomColor: 'text.secondary' },
        }}
      >
        {shown}{' '}
        <EditIcon sx={{ fontSize: 10, verticalAlign: 'top', opacity: 0.6 }} />
      </Typography>
    );
  }

  return (
    <TextField
      autoFocus
      value={currentValue}
      onChange={(e) => setCurrentValue(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      variant="standard"
      type={type === 'number' ? 'number' : 'text'}
      multiline={type === 'multiline'}
      fullWidth={fullWidth}
      slotProps={{ htmlInput: { 'aria-label': ariaLabel } }}
      sx={{
        minWidth: minWidth ?? (type === 'number' ? 60 : 120),
        maxWidth: fullWidth ? undefined : 400,
      }}
    />
  );
};

export default EditableField;
