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
      variant="body1"
      component="span"
      sx={tooltip ? { textDecoration: 'underline dotted', cursor: 'help' } : {}}
    >
      {`${label} :`}
    </Typography>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '4px',
        alignItems: 'baseline',
        flexWrap: 'wrap',
      }}
    >
      {tooltip ? (
        <Tooltip title={tooltip} arrow>
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
      />
      {postValue !== undefined && postValue !== null && (
        <Typography variant="body1" component="span">
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
