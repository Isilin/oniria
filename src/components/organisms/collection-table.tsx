'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import EditableField from '../atoms/editable-field';
import DeleteConfirmation from '../molecules/_shared/delete-confirmation';

type Row = { id: string } & Record<string, unknown>;

export interface Column<R extends Row> {
  key: keyof R & string;
  label: string;
  type?: 'text' | 'number' | 'multiline' | 'boolean' | 'select';
  options?: { value: string; label: string }[];
  /** Pour un `select` : pas de choix vide. */
  required?: boolean;
  /** Affichage personnalisé (en lecture seule). */
  render?: (row: R) => ReactNode;
  /** Texte affiché à la place de la valeur brute (ex. chiffres romains). */
  display?: (row: R) => string | undefined;
  tooltip?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

interface Props<R extends Row> {
  title?: ReactNode;
  rows: R[];
  columns: Column<R>[];
  editable: boolean;
  onAdd?: () => void;
  onUpdate: (id: string, patch: Partial<R>) => void;
  onDelete: (id: string) => void;
  addLabel?: string;
  emptyLabel?: string;
  footer?: ReactNode;
  itemLabel?: (row: R) => string;
}

const toValue = (type: Column<Row>['type'], raw: string) => {
  if (type === 'number') return raw === '' ? null : Number(raw);
  return raw;
};

function CollectionTable<R extends Row>({
  title,
  rows,
  columns,
  editable,
  onAdd,
  onUpdate,
  onDelete,
  addLabel = 'Ajouter',
  emptyLabel = 'Rien pour le moment.',
  footer,
  itemLabel,
}: Props<R>) {
  const [toDelete, setToDelete] = useState<R | null>(null);

  const renderCell = (row: R, column: Column<R>) => {
    if (column.render) return column.render(row);
    const value = row[column.key] as string | number | boolean | null;

    if (column.type === 'boolean') {
      return (
        <Checkbox
          size="small"
          checked={!!value}
          disabled={!editable}
          onChange={(e) =>
            onUpdate(row.id, { [column.key]: e.target.checked } as Partial<R>)
          }
          slotProps={{
            input: { 'aria-label': column.label },
          }}
        />
      );
    }

    if (column.type === 'select') {
      const option = column.options?.find((o) => o.value === value);
      if (!editable) return option?.label ?? '-';
      return (
        <Select
          size="small"
          variant="standard"
          value={(value as string) ?? ''}
          displayEmpty
          onChange={(e) =>
            onUpdate(row.id, {
              [column.key]: e.target.value || null,
            } as Partial<R>)
          }
          inputProps={{ 'aria-label': column.label }}
        >
          {!column.required && (
            <MenuItem value="">
              <em>-</em>
            </MenuItem>
          )}
          {column.options?.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      );
    }

    return (
      <EditableField
        value={value as string | number | null}
        display={column.display?.(row)}
        type={column.type ?? 'text'}
        editable={editable}
        aria-label={column.label}
        minWidth={column.type === 'number' ? 50 : 100}
        onChange={(raw) =>
          onUpdate(row.id, {
            [column.key]: toValue(column.type, raw),
          } as Partial<R>)
        }
      />
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
      }}
    >
      {title &&
        (typeof title === 'string' ? (
          <Typography variant="h5">{title}</Typography>
        ) : (
          title
        ))}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={{ width: column.width, fontWeight: 'bold' }}
                >
                  {column.tooltip ? (
                    <Tooltip title={column.tooltip} arrow>
                      <span style={{ textDecoration: 'underline dotted' }}>
                        {column.label}
                      </span>
                    </Tooltip>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {editable && <TableCell sx={{ width: 40 }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Typography variant="body2" color="textSecondary">
                    {emptyLabel}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align}>
                    {renderCell(row, column)}
                  </TableCell>
                ))}
                {editable && (
                  <TableCell padding="none">
                    <IconButton
                      size="small"
                      aria-label="Supprimer"
                      onClick={() => setToDelete(row)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {footer}
      {editable && onAdd && (
        <Box>
          <Button size="small" startIcon={<AddIcon />} onClick={onAdd}>
            {addLabel}
          </Button>
        </Box>
      )}
      <DeleteConfirmation
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onValidated={() => toDelete && onDelete(toDelete.id)}
        message={`Supprimer « ${
          (toDelete && (itemLabel?.(toDelete) ?? (toDelete.name as string))) ||
          'cet élément'
        } » ?`}
      />
    </Box>
  );
}

export default CollectionTable;
