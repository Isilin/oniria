'use client';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import EditableField, { EditableValue } from '../atoms/editable-field';
import PreviewValue from '../atoms/preview-value';

interface Props {
  label: string;
  value: EditableValue;
  /**
   * Aperçu des points en attente : valeur de la fiche enregistrée et sens du
   * changement (la valeur affichée est alors en lecture seule).
   */
  preview?: { before: ReactNode; delta: number };
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
  preview,
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
      {preview?.delta ? (
        <Typography variant="body1" component="span">
          <PreviewValue before={preview.before} delta={preview.delta}>
            {value}
          </PreviewValue>
        </Typography>
      ) : (
        <EditableField
          value={value}
          onChange={onEdit}
          editable={editable && !!onEdit}
          type={type}
          aria-label={label}
        />
      )}
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
