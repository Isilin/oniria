'use client';

import EditIcon from '@mui/icons-material/Edit';
import { TextField, Typography, TypographyProps } from '@mui/material';
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
  /**
   * Style du texte affiché. Par défaut `hand` : ce que le joueur écrit est
   * manuscrit, à l'encre bleue (voir DESIGN.md).
   */
  variant?: TypographyProps['variant'];
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
  variant = 'hand',
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
  const handwritten = variant === 'hand';
  // L'encre bleue pour ce qui est écrit ; le tiret d'une case vide reste pâle.
  const ink = !asString
    ? 'text.secondary'
    : variant === 'inherit'
      ? 'inherit'
      : handwritten
        ? 'primary.main'
        : 'text.primary';

  if (!editable) {
    return (
      <Typography
        variant={variant}
        component="span"
        sx={{
          color: ink,
          whiteSpace: type === 'multiline' ? 'pre-line' : undefined,
        }}
      >
        {shown}
      </Typography>
    );
  }

  if (!focused) {
    // Au repos, une valeur modifiable se lit comme du texte : le crayon et le
    // souligné n'apparaissent qu'au survol ou au focus. Tab passe d'une
    // valeur à l'autre ; Entrée ou Espace ouvre l'édition.
    return (
      <Typography
        variant={variant}
        component="span"
        role="button"
        tabIndex={0}
        aria-label={ariaLabel ? `Modifier ${ariaLabel}` : undefined}
        onClick={() => setFocused(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFocused(true);
          }
        }}
        sx={{
          color: ink,
          cursor: 'pointer',
          borderBottom: '1px dashed transparent',
          whiteSpace: type === 'multiline' ? 'pre-line' : undefined,
          '& .edit-mark': { opacity: 0, transition: 'opacity 120ms ease-out' },
          ':hover, :focus-visible': { borderBottomColor: 'text.secondary' },
          ':hover .edit-mark, :focus-visible .edit-mark': { opacity: 0.7 },
          // Au toucher, pas de crayon : un pointillé discret signale la valeur modifiable.
          '@media (hover: none)': {
            '& .edit-mark': { display: 'none' },
            borderBottom: '1px dotted',
            borderBottomColor:
              'color-mix(in srgb, var(--mui-palette-text-secondary) 40%, transparent)',
          },
        }}
      >
        {shown}
        <EditIcon
          className="edit-mark"
          aria-hidden
          sx={{ fontSize: 11, verticalAlign: 'top', ml: 0.25 }}
        />
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
