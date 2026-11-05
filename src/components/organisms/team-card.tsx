'use client';

import { FullSheet } from '@/lib/db/sheet';
import { useSheets } from '@/lib/hooks/use-sheet';
import { useTeam } from '@/lib/hooks/use-team';
import { computeSheet, FACULTIES, formatFaculty } from '@/lib/rules';
import { ALL_SCOPES, unlockedScopes, xpSummary } from '@/lib/rules/xp';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
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
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import EditableField from '../atoms/editable-field';
import LoadError from '../atoms/load-error';
import DeleteConfirmation from '../molecules/_shared/delete-confirmation';
import { formatAmounts } from './xp-dialogs';
import XpGrantDialog from './xp-grant-dialog';

/** Une Existence : la valeur, et son seuil en légende dessous. */
const gauge = (current: number | null, max: number, threshold: number) => (
  <>
    {current ?? max}/{max}
    <Typography
      variant="caption"
      color="textSecondary"
      sx={{ display: 'block', whiteSpace: 'nowrap' }}
    >
      seuil {threshold}
    </Typography>
  </>
);

const MemberRow = ({
  sheet,
  onRemove,
}: {
  sheet: FullSheet;
  onRemove: () => void;
}) => {
  const [confirm, setConfirm] = useState(false);
  const c = computeSheet(sheet);
  const xp = xpSummary(sheet);

  return (
    <TableRow hover>
      {/* Un nom courant (« Corwin (test) ») tient sur sa ligne. */}
      <TableCell sx={{ minWidth: '14ch' }}>
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
      <TableCell sx={{ minWidth: '16ch' }}>
        {formatAmounts(xp.left)}
        {xp.unlocked.length > 0 && (
          <Chip
            size="small"
            color="warning"
            variant="outlined"
            label={xp.allocation.feasible ? 'à valider' : 'en création'}
            sx={{ ml: 1 }}
          />
        )}
        {xp.consistency.diff !== 0 && (
          <Tooltip title="Le compte d'XP de la fiche n'est pas bon : voir la fiche.">
            <Chip
              size="small"
              color="error"
              variant="outlined"
              label="écart"
              sx={{ ml: 1 }}
            />
          </Tooltip>
        )}
      </TableCell>
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
          title={`Retirer ${sheet.name} de la table ?`}
          message="La fiche est conservée ; elle n'apparaît simplement plus ici."
          confirmLabel="Retirer"
        />
      </TableCell>
    </TableRow>
  );
};

const TeamCard = ({ id }: { id: string }) => {
  const {
    team,
    isLoading,
    error,
    retry,
    rename,
    addMember,
    removeMember,
    grantXp,
  } = useTeam(id);
  const { sheets } = useSheets();
  const [grantOpen, setGrantOpen] = useState(false);
  const [recipients, setRecipients] = useState<string[] | null>(null);

  if (isLoading && !team) return <CircularProgress />;
  if (!team)
    return (
      <LoadError
        what="La table n'a pas pu être ouverte."
        error={error ?? new Error('Table introuvable.')}
        onRetry={retry}
      />
    );

  const memberIds = new Set(team.members.map((m) => m.id));
  const chosen = recipients ?? team.members.map((m) => m.id);
  const candidates = [...(sheets?.own ?? []), ...(sheets?.others ?? [])].filter(
    (s) => !memberIds.has(s.id),
  );
  // Le raccourci « Création » n'a de sens que si un personnage choisi est en création.
  const creationChosen = team.members.some(
    (m) =>
      chosen.includes(m.id) && unlockedScopes(m).length === ALL_SCOPES.length,
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
            // Un nom fait d'espaces ne remplace pas le nom de la table.
            onChange={(name) => name.trim() && rename(name.trim())}
          />
        </Typography>
        <Typography variant="subtitle1">
          {team.members.length} personnage{team.members.length > 1 ? 's' : ''}
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Vue d&apos;ensemble
            </Typography>
            <Button
              size="small"
              variant="outlined"
              disabled={team.members.length === 0}
              onClick={() => {
                setRecipients(null);
                setGrantOpen(true);
              }}
            >
              Distribuer de l&apos;XP
            </Button>
          </Box>
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
                  <TableCell>XP restante</TableCell>
                  <TableCell>Facultés</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {team.members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12}>
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
      <XpGrantDialog
        open={grantOpen}
        onClose={() => setGrantOpen(false)}
        title="Distribuer de l'expérience"
        disabled={chosen.length === 0}
        creationShortcut={creationChosen}
        recipients={chosen.length}
        onSubmit={(grant) => grantXp({ ...grant, sheetIds: chosen })}
      >
        <FormGroup sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Personnages
          </Typography>
          {team.members.map((m) => (
            <FormControlLabel
              key={m.id}
              control={
                <Checkbox
                  size="small"
                  checked={chosen.includes(m.id)}
                  onChange={(e) =>
                    setRecipients(
                      e.target.checked
                        ? [...chosen, m.id]
                        : chosen.filter((c) => c !== m.id),
                    )
                  }
                />
              }
              label={`${m.name} (${m.user.name ?? '?'})`}
            />
          ))}
        </FormGroup>
      </XpGrantDialog>
    </Box>
  );
};

export default TeamCard;
