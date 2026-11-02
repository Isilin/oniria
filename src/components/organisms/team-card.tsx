'use client';

import { FullSheet } from '@/lib/db/sheet';
import { useSheets } from '@/lib/hooks/use-sheet';
import { useTeam } from '@/lib/hooks/use-team';
import { computeSheet, FACULTIES, formatFaculty } from '@/lib/rules';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import EditableField from '../atoms/editable-field';
import DeleteConfirmation from '../molecules/_shared/delete-confirmation';

const gauge = (current: number | null, max: number, threshold: number) =>
  `${current ?? max}/${max} (seuil ${threshold})`;

const MemberRow = ({
  sheet,
  onRemove,
}: {
  sheet: FullSheet;
  onRemove: () => void;
}) => {
  const [confirm, setConfirm] = useState(false);
  const c = computeSheet(sheet);

  return (
    <TableRow hover>
      <TableCell>
        <MuiLink component={Link} href={`/sheet/${sheet.id}`}>
          {sheet.name}
        </MuiLink>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            display: 'block',
          }}
        >
          {sheet.user.name}
        </Typography>
      </TableCell>
      <TableCell>
        {gauge(sheet.current_health, c.health, c.healthThreshold)}
      </TableCell>
      <TableCell>
        {gauge(sheet.current_stability, c.stability, c.stabilityThreshold)}
      </TableCell>
      <TableCell>
        {gauge(sheet.current_radiance, c.radiance, c.radianceThreshold)}
      </TableCell>
      <TableCell>
        {sheet.current_mai ?? c.mai}/{c.mai}
      </TableCell>
      <TableCell>{c.initiative}</TableCell>
      <TableCell>
        {c.protection.max ? `${c.protection.current}/${c.protection.max}` : '-'}
      </TableCell>
      <TableCell>{c.bulk} %</TableCell>
      <TableCell>{c.damage}</TableCell>
      <TableCell>
        <Tooltip
          title={FACULTIES.map(
            (f) => `${f.label} ${formatFaculty(c.faculties[f.key])}`,
          ).join(' · ')}
        >
          <span style={{ textDecoration: 'underline dotted' }}>voir</span>
        </Tooltip>
      </TableCell>
      <TableCell padding="none">
        <IconButton
          aria-label="Retirer de la table"
          onClick={() => setConfirm(true)}
        >
          <PersonRemoveIcon fontSize="small" />
        </IconButton>
        <DeleteConfirmation
          open={confirm}
          onClose={() => setConfirm(false)}
          onValidated={onRemove}
          message={`Retirer ${sheet.name} de la table ? La fiche est conservée.`}
        />
      </TableCell>
    </TableRow>
  );
};

const TeamCard = ({ id }: { id: string }) => {
  const { team, isLoading, error, rename, addMember, removeMember } =
    useTeam(id);
  const { sheets } = useSheets();

  if (isLoading) return <CircularProgress />;
  if (error || !team)
    return (
      <Alert severity="error">{error?.message ?? 'Table introuvable.'}</Alert>
    );

  const memberIds = new Set(team.members.map((m) => m.id));
  const candidates = [...(sheets?.own ?? []), ...(sheets?.others ?? [])].filter(
    (s) => !memberIds.has(s.id),
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1">
          {team.name}
        </Typography>
        <Typography variant="body2" component="div">
          Renommer :{' '}
          <EditableField
            value={team.name}
            aria-label="Nom de la table"
            onChange={(name) => name && rename(name)}
          />
        </Typography>
        <Typography variant="subtitle1">
          {team.members.length} personnage{team.members.length > 1 ? 's' : ''}
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Vue d&apos;ensemble
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Personnage</TableCell>
                  <TableCell>Santé</TableCell>
                  <TableCell>Équilibre</TableCell>
                  <TableCell>Éclat</TableCell>
                  <TableCell>Maï</TableCell>
                  <TableCell>Initiative</TableCell>
                  <TableCell>Protection</TableCell>
                  <TableCell>Encombrement</TableCell>
                  <TableCell>Dégâts</TableCell>
                  <TableCell>Facultés</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {team.members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11}>
                      <Typography color="textSecondary">
                        Aucun personnage à cette table.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {team.members.map((sheet) => (
                  <MemberRow
                    key={sheet.id}
                    sheet={sheet}
                    onRemove={() => removeMember(sheet.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Autocomplete
            sx={{ mt: 2, maxWidth: 400 }}
            options={candidates}
            getOptionLabel={(s) => `${s.name} (${s.user.name ?? '?'})`}
            value={null}
            blurOnSelect
            onChange={(e, sheet) => sheet && addMember(sheet.id)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ajouter un personnage"
                size="small"
              />
            )}
            noOptionsText="Aucune autre fiche"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamCard;
