'use client';

import { FullSheet } from '@/lib/db/sheet';
import { Amounts, POOLS } from '@/lib/rules/xp';
import {
  batchTitle,
  entryDate,
  entryDetail,
  formatSigned,
  groupEntries,
  JOURNAL_KINDS,
  signedAmounts,
  sumAmounts,
} from '@/lib/sheet/journal';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Fragment, useState } from 'react';
import DeleteConfirmation from '../molecules/_shared/delete-confirmation';

type Entry = FullSheet['xpEntries'][number];

const AmountCells = ({ amounts }: { amounts: Amounts }) => (
  <>
    {POOLS.map((p) => (
      <TableCell
        key={p.key}
        align="right"
        sx={{
          color:
            amounts[p.key] > 0
              ? 'success.main'
              : amounts[p.key] < 0
                ? 'error.main'
                : undefined,
          whiteSpace: 'nowrap',
        }}
      >
        {formatSigned(amounts[p.key])}
      </TableCell>
    ))}
  </>
);

const EntryRow = ({
  entry,
  nested,
  onDelete,
}: {
  entry: Entry;
  nested?: boolean;
  onDelete?: (entry: Entry) => void;
}) => (
  <TableRow hover>
    <TableCell sx={{ whiteSpace: 'nowrap' }}>
      {nested ? '' : entryDate(entry)}
    </TableCell>
    <TableCell sx={{ pl: nested ? 4 : undefined }}>
      <Chip
        size="small"
        variant="outlined"
        color={JOURNAL_KINDS[entry.kind].color}
        label={JOURNAL_KINDS[entry.kind].label}
        sx={{ mr: 1 }}
      />
      {entry.label}
      <Typography component="span" variant="body2" color="textSecondary">
        {entryDetail(entry)}
      </Typography>
    </TableCell>
    <AmountCells amounts={signedAmounts(entry)} />
    <TableCell>
      <Typography variant="caption" color="textSecondary">
        {entry.author?.name ?? ''}
      </Typography>
    </TableCell>
    <TableCell padding="none">
      {onDelete && entry.kind === 'GAIN' && (
        <Tooltip title="Supprimer cette attribution">
          <IconButton
            size="small"
            aria-label={`Supprimer l'attribution ${entry.label}`}
            onClick={() => onDelete(entry)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </TableCell>
  </TableRow>
);

const GroupRows = ({
  entries,
  onDelete,
}: {
  entries: Entry[];
  onDelete?: (entry: Entry) => void;
}) => {
  const [open, setOpen] = useState(false);
  const total = sumAmounts(entries.map(signedAmounts));
  return (
    <>
      <TableRow
        hover
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer' }}
        aria-expanded={open}
      >
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {entryDate(entries[0])}
        </TableCell>
        <TableCell>
          {open ? (
            <ExpandLessIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
          ) : (
            <ExpandMoreIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
          )}{' '}
          <strong>{batchTitle(entries)}</strong>{' '}
          <Typography component="span" variant="body2" color="textSecondary">
            ({entries.length} écritures)
          </Typography>
        </TableCell>
        <AmountCells amounts={total} />
        <TableCell>
          <Typography variant="caption" color="textSecondary">
            {entries[0].author?.name ?? ''}
          </Typography>
        </TableCell>
        <TableCell />
      </TableRow>
      {open &&
        entries.map((entry) => (
          <EntryRow key={entry.id} entry={entry} nested onDelete={onDelete} />
        ))}
    </>
  );
};

/** Historique de l'expérience d'une fiche, du plus récent au plus ancien. */
const XpJournal = ({
  entries,
  onDelete,
}: {
  entries: Entry[];
  /** MJ : suppression d'une attribution. */
  onDelete?: (entryId: string) => void;
}) => {
  const [toDelete, setToDelete] = useState<Entry | null>(null);

  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        Aucune expérience pour le moment.
      </Typography>
    );
  }

  const ask = onDelete ? setToDelete : undefined;

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Écriture</TableCell>
              {POOLS.map((p) => (
                <TableCell key={p.key} align="right">
                  {p.label}
                </TableCell>
              ))}
              <TableCell>Par</TableCell>
              <TableCell sx={{ width: 40 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {groupEntries(entries).map((group) => (
              <Fragment key={group[0].id}>
                {group.length > 1 ? (
                  <GroupRows entries={group} onDelete={ask} />
                ) : (
                  <EntryRow entry={group[0]} onDelete={ask} />
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmation
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onValidated={() => toDelete && onDelete?.(toDelete.id)}
        message={`Supprimer l'attribution « ${toDelete?.label ?? ''} » ? L'XP correspondante est retirée de la fiche.`}
      />
    </>
  );
};

export default XpJournal;
