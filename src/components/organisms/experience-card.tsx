'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { ALL_SCOPES, POOLS, SCOPE_BY_KEY, Scope, sum } from '@/lib/rules/xp';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpenOutlined';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import XpBar, { XpBarLegend, XpBarPart } from '../molecules/xp-bar';
import { formatAmounts } from './xp-dialogs';
import XpGrantDialog from './xp-grant-dialog';
import XpJournal from './xp-journal';
import XpResetDialog from './xp-reset-dialog';

const scopeList = (scopes: Scope[]) =>
  scopes.map((s) => SCOPE_BY_KEY[s].label).join(', ');

const ExperienceCard = ({ id }: { id: string }) => {
  const { sheet, xp, canEdit, isAdmin, validate, reset, grantXp, deleteGrant } =
    useSheet(id);
  const [grantOpen, setGrantOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmValidate, setConfirmValidate] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  if (!sheet || !xp) return null;

  const draft = xp.unlocked.length > 0;
  const creation = xp.unlocked.length === ALL_SCOPES.length;
  const due = xp.dues.reduce((t, d) => t + d.amount, 0);
  const missing = Object.values(xp.missingByScope).reduce((t, m) => t + m, 0);
  const { consistency } = xp;
  const legend: XpBarPart[] = [
    'spent',
    ...(sum(xp.allocation.total) > 0 ? (['pending'] as const) : []),
    'left',
    ...(POOLS.some((p) => xp.left[p.key] < 0) ? (['negative'] as const) : []),
  ];
  const mismatches = Object.entries(consistency.byScope).filter(
    ([, s]) => s.expected !== s.recorded,
  );

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            mb: 1.5,
          }}
        >
          <Typography variant="h4" component="h2">
            Expérience
          </Typography>
          <Chip
            size="small"
            icon={draft ? <LockOpenIcon /> : <LockIcon />}
            color={draft ? 'warning' : 'default'}
            label={
              !draft ? 'Validée' : creation ? 'En création' : 'Reset en cours'
            }
          />
        </Box>

        <Grid container spacing={3}>
          {POOLS.map((pool) => (
            <Grid key={pool.key} size={{ xs: 12, sm: 4 }}>
              <XpBar
                label={pool.label}
                description={pool.description}
                gained={xp.gained[pool.key]}
                spent={xp.spent[pool.key]}
                left={xp.left[pool.key]}
                pending={xp.allocation.total[pool.key]}
              />
            </Grid>
          ))}
        </Grid>
        <XpBarLegend parts={legend} />

        {draft && (
          <Alert
            severity={xp.allocation.feasible ? 'info' : 'warning'}
            sx={{ mt: 2 }}
            action={
              canEdit && (
                <Button
                  color="inherit"
                  size="small"
                  disabled={!xp.allocation.feasible}
                  onClick={() => setConfirmValidate(true)}
                >
                  Valider
                </Button>
              )
            }
          >
            <AlertTitle>
              {creation
                ? 'Création : tout se modifie librement'
                : `Reset : ${scopeList(xp.unlocked)} se modifie librement`}
            </AlertTitle>
            {due === 0
              ? 'Rien à payer pour le moment.'
              : xp.allocation.feasible
                ? `À payer à la validation : ${due} XP (${formatAmounts(xp.allocation.total)}).`
                : `À payer à la validation : ${due} XP.`}
            {!xp.allocation.feasible && (
              <>
                {' '}
                Il manque {missing} XP :{' '}
                {Object.entries(xp.missingByScope)
                  .map(([s, m]) => `${SCOPE_BY_KEY[s as Scope].label} ${m}`)
                  .join(', ')}
                .
              </>
            )}
          </Alert>
        )}

        {consistency.diff !== 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>Le compte n&apos;est pas bon</AlertTitle>
            {draft ? 'Les parties validées valent' : 'La fiche vaut'}{' '}
            {consistency.expected} XP, mais {consistency.recorded} XP sont
            enregistrés comme dépensés pour elles :{' '}
            {consistency.diff > 0
              ? `${consistency.diff} XP n'ont pas été payés.`
              : `${-consistency.diff} XP ont été payés en trop.`}
            {consistency.legacy > 0 ? (
              <>
                {' '}
                Dont {consistency.legacy} XP de dépenses reprises de
                l&apos;ancienne fiche, non détaillées.
              </>
            ) : (
              mismatches.length > 0 && (
                <>
                  {' '}
                  En cause :{' '}
                  {mismatches
                    .map(
                      ([s, v]) =>
                        `${SCOPE_BY_KEY[s as Scope].label} (vaut ${v.expected}, payé ${v.recorded})`,
                    )
                    .join(', ')}
                  .
                </>
              )
            )}{' '}
            {isAdmin
              ? 'Un reset complet recalcule tout depuis la fiche.'
              : 'Le MJ peut accorder un reset pour tout recalculer.'}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          {isAdmin && (
            <>
              <Button size="small" onClick={() => setGrantOpen(true)}>
                Attribuer de l&apos;XP
              </Button>
              {/* En création, tout se modifie déjà librement : rien à remettre à zéro. */}
              {!creation && (
                <Button
                  size="small"
                  color="warning"
                  onClick={() => setResetOpen(true)}
                >
                  Accorder un reset
                </Button>
              )}
            </>
          )}
          <Button
            size="small"
            startIcon={<HistoryIcon />}
            onClick={() => setJournalOpen(!journalOpen)}
            aria-expanded={journalOpen}
          >
            Historique ({sheet.xpEntries.length})
          </Button>
        </Box>
        <Collapse in={journalOpen} unmountOnExit>
          <Box sx={{ mt: 1 }}>
            <XpJournal
              entries={sheet.xpEntries}
              onDelete={isAdmin ? deleteGrant : undefined}
            />
          </Box>
        </Collapse>
      </CardContent>

      <Dialog open={confirmValidate} onClose={() => setConfirmValidate(false)}>
        <DialogTitle>Valider la fiche ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {due > 0
              ? `${due} XP seront dépensés (${formatAmounts(xp.allocation.total)}).`
              : 'Aucune XP à dépenser.'}{' '}
            Ensuite, {scopeList(xp.unlocked)} ne se modifiera plus librement :
            chaque amélioration sera un achat, et seul le MJ pourra baisser ou
            retirer ce qui a été acquis.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmValidate(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (await validate()) setConfirmValidate(false);
            }}
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>
      {isAdmin && (
        <>
          <XpGrantDialog
            open={grantOpen}
            onClose={() => setGrantOpen(false)}
            onSubmit={grantXp}
            creationShortcut={creation}
          />
          <XpResetDialog
            open={resetOpen}
            onClose={() => setResetOpen(false)}
            unlocked={xp.unlocked}
            onSubmit={reset}
          />
        </>
      )}
    </Card>
  );
};

export default ExperienceCard;
