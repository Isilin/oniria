'use client';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import EditableField, { EditableValue } from '../atoms/editable-field';

interface Props {
  label: string;
  value: EditableValue;
  tooltip?: ReactNode;
  /** Si fourni (et si la fiche est modifiable), la valeur est éditable. */
  onEdit?: (newVal: string) => void;
  editable?: boolean;
  type?: 'text' | 'number' | 'multiline';
  postValue?: ReactNode;
  hint?: ReactNode;
}

/**
 * Une ligne de la fiche : `Libellé : valeur / max`. Le libellé porte la
 * règle en infobulle ; il est focalisable pour qu'elle se lise au clavier.
 */
const SheetField = ({
  label,
  value,
  tooltip,
  onEdit,
  editable = false,
  type = 'number',
  postValue,
  hint,
}: Props) => {
  const labelNode = (
    <Typography
      variant="body2"
      component="span"
      color="textSecondary"
      tabIndex={tooltip ? 0 : undefined}
      sx={
        tooltip
          ? {
              cursor: 'help',
              textDecoration: 'underline dotted',
              textDecorationColor: 'var(--mui-palette-rule)',
              textUnderlineOffset: '0.25em',
              '&:hover, &:focus-visible': {
                color: 'text.primary',
                textDecorationColor: 'currentColor',
              },
            }
          : undefined
      }
    >
      {`${label} :`}
    </Typography>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '6px',
        alignItems: 'baseline',
        flexWrap: 'wrap',
      }}
    >
      {tooltip ? (
        <Tooltip title={tooltip} describeChild>
          {labelNode}
        </Tooltip>
      ) : (
        labelNode
      )}
      <EditableField
        value={value}
        onChange={onEdit}
        editable={editable && !!onEdit}
        type={type}
        aria-label={label}
        variant={type === 'number' ? 'numeral' : 'body1'}
      />
      {postValue !== undefined && postValue !== null && (
        <Typography variant="body2" component="span" color="textSecondary">
          {postValue}
        </Typography>
      )}
      {hint && (
        <Typography variant="caption" color="textSecondary" component="span">
          {hint}
        </Typography>
      )}
    </Box>
  );
};

export default SheetField;
