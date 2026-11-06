'use client';

import { RULES } from '@/theme/theme';
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
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  /** Pour un `select` : ramène une valeur stockée vers une option. */
  normalize?: (value: unknown) => string | null;
  /** Affichage personnalisé (en lecture seule). */
  render?: (row: R) => ReactNode;
  /** Texte affiché à la place de la valeur brute (ex. chiffres romains). */
  display?: (row: R) => string | undefined;
  tooltip?: string;
  width?: number | string;
  /** Largeur sous laquelle la colonne ne descend pas (défaut pour `name`). */
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
}

// Un nom écrit à la main se coupe en deux lignes au plus, jamais mot par mot
// (« Bâton du Reflet ») : quand la place manque, le tableau défile.
const NAME_MIN_WIDTH = '9rem';

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
  /** Faux : pas de bouton de suppression (ex. élément validé, joueur·euse). */
  deletable?: boolean;
  /** Faux : pas de confirmation (un autre dialogue s'en charge). */
  confirmDelete?: boolean;
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
  deletable = true,
  confirmDelete = true,
}: Props<R>) {
  const [toDelete, setToDelete] = useState<R | null>(null);
  // Sur téléphone, un tableau de quinze colonnes ne se lit qu'en défilant de
  // côté : chaque ligne devient un bloc sur la feuille, le nom en tête.
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));

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
      const selected = column.normalize
        ? column.normalize(value)
        : (value as string);
      const option = column.options?.find((o) => o.value === selected);
      if (!editable) return option?.label ?? '-';
      return (
        <Select
          size="small"
          variant="standard"
          value={option ? selected : ''}
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
              <Box component="span" sx={{ color: 'text.secondary' }}>
                -
              </Box>
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

  const columnLabel = (column: Column<R>) =>
    column.tooltip ? (
      <Tooltip title={column.tooltip} arrow>
        <span style={{ textDecoration: 'underline dotted' }}>
          {column.label}
        </span>
      </Tooltip>
    ) : (
      column.label
    );

  const deleteButton = (row: R) =>
    editable &&
    deletable && (
      <IconButton
        size="small"
        aria-label="Supprimer"
        onClick={() => (confirmDelete ? setToDelete(row) : onDelete(row.id))}
        sx={{ flexShrink: 0 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    );

  // Téléphone : le nom (ou la première colonne) en tête de bloc, les cases à
  // cocher devant lui, la corbeille au bout ; le reste en libellés et valeurs.
  const titleColumn =
    columns.find((c) => c.key === 'name') ??
    columns.find((c) => c.type !== 'boolean') ??
    columns[0];
  const leadColumns = columns.filter(
    (c) => c.type === 'boolean' && c !== titleColumn,
  );
  const fieldColumns = columns.filter(
    (c) => c !== titleColumn && !leadColumns.includes(c),
  );

  const list = (
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        borderTop: RULES.group,
      }}
    >
      {rows.length === 0 && (
        <Box
          component="li"
          sx={{ py: 1, borderBottom: 1, borderColor: 'rule' }}
        >
          <Typography variant="body2" color="textSecondary">
            {emptyLabel}
          </Typography>
        </Box>
      )}
      {rows.map((row) => (
        <Box
          component="li"
          key={row.id}
          sx={{ py: 1, borderBottom: 1, borderColor: 'rule' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {leadColumns.map((column) => (
              <Box
                key={column.key}
                sx={{ display: 'flex', alignItems: 'center', ml: -1 }}
              >
                {renderCell(row, column)}
                <Typography
                  variant="overline"
                  color="textSecondary"
                  aria-hidden
                >
                  {column.label}
                </Typography>
              </Box>
            ))}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {renderCell(row, titleColumn)}
            </Box>
            {deleteButton(row)}
          </Box>
          {fieldColumns.length > 0 && (
            <Box
              component="dl"
              sx={{
                m: 0,
                mt: 0.5,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(7.5rem, 1fr))',
                columnGap: 2,
                rowGap: 1,
              }}
            >
              {fieldColumns.map((column) => (
                <Box
                  key={column.key}
                  sx={{
                    minWidth: 0,
                    ...(column.type === 'multiline' && {
                      gridColumn: '1 / -1',
                    }),
                  }}
                >
                  <Typography
                    component="dt"
                    variant="overline"
                    color="textSecondary"
                    sx={{ display: 'block' }}
                  >
                    {columnLabel(column)}
                  </Typography>
                  <Box component="dd" sx={{ m: 0 }}>
                    {renderCell(row, column)}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );

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
      {phone ? (
        list
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    sx={{
                      width: column.width,
                      minWidth:
                        column.minWidth ??
                        (column.key === 'name' ? NAME_MIN_WIDTH : undefined),
                    }}
                  >
                    {columnLabel(column)}
                  </TableCell>
                ))}
                {editable && deletable && <TableCell sx={{ width: 40 }} />}
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
                  {editable && deletable && (
                    <TableCell padding="none">{deleteButton(row)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
