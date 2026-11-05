'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import {
  ALL_SCOPES,
  creationStep,
  POOLS,
  SCOPE_BY_KEY,
  Scope,
  sum,
} from '@/lib/rules/xp';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpenOutlined';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
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
import { EASE, MEDIA } from '@/theme/theme';
import { useState } from 'react';
import BusyButton from '../atoms/busy-button';
import CreationSteps from '../molecules/creation-steps';
import XpBar, { XpBarLegend, XpBarPart } from '../molecules/xp-bar';
import { formatAmounts } from './xp-dialogs';
import XpGrantDialog from './xp-grant-dialog';
import XpJournal from './xp-journal';
import XpResetDialog from './xp-reset-dialog';

const scopeList = (scopes: Scope[]) =>
  scopes.map((s) => SCOPE_BY_KEY[s].label).join(', ');

const ExperienceCard = ({ id }: { id: string }) => {
  const {
    sheet,
    computed,
    xp: saved,
    // Avec les points en attente : ce qu'il resterait à payer à la validation.
    xpPreview: xp,
    points,
    canEdit,
    isAdmin,
    validate,
    reset,
    grantXp,
    deleteGrant,
  } = useSheet(id);
  const [grantOpen, setGrantOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmValidate, setConfirmValidate] = useState(false);
  // Pendant l'envoi, « Valider » ne repart pas (un double clic validait puis
  // affichait « La fiche est déjà validée. »).
  const [validating, setValidating] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  // Le tampon « Validée » s'abat quand la fiche est validée, puis à chaque
  // achat validé (l'XP dépensée augmente). Rien au premier affichage.
  const status = !xp
    ? null
    : xp.unlocked.length === 0
      ? 'Validée'
      : xp.unlocked.length === ALL_SCOPES.length
        ? 'En création'
        : 'Reset en cours';
  const spentTotal = xp ? sum(xp.spent) : 0;
  const [stamp, setStamp] = useState({ status, spentTotal, count: 0 });
  if (status !== stamp.status || spentTotal !== stamp.spentTotal) {
    // Valeur dérivée pendant le rendu (et non dans un effet).
    const pressed =
      status === 'Validée' &&
      stamp.status !== null &&
      (stamp.status !== 'Validée' || spentTotal > stamp.spentTotal);
    setStamp({ status, spentTotal, count: stamp.count + (pressed ? 1 : 0) });
  }

  if (!sheet || !xp) return null;

  const draft = xp.unlocked.length > 0;
  const creation = xp.unlocked.length === ALL_SCOPES.length;
  const creationAt = creationStep(xp);
  const due = xp.dues.reduce((t, d) => t + d.amount, 0);
  const missing = Object.values(xp.missingByScope).reduce((t, m) => t + m, 0);
  const waiting = points.plan.lines.length > 0;
  const { consistency } = saved;
  const legend: XpBarPart[] = [
    'spent',
    ...(sum(xp.allocation.total) > 0 ? (['pending'] as const) : []),
    ...(sum(points.plan.spending) > 0 ? (['draft'] as const) : []),
    'left',
    ...(POOLS.some((p) => xp.left[p.key] < 0) ? (['negative'] as const) : []),
  ];
  const mismatches = Object.entries(consistency.byScope).filter(
    ([, s]) => s.expected !== s.recorded,
  );

  return (
    <Box
      component="section"
      id="experience"
      sx={{
        minWidth: 0,
        // Atteinte depuis le rappel de création : le titre s'arrête sous
        // l'encadré des Existences collé en haut, ou sous la bande de 44 px
        // qui le remplace sur petit écran.
        scrollMarginTop: 140,
        [MEDIA.smallScreen]: {
          scrollMarginTop: 64,
        },
      }}
    >
      <Box>
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
            // Nouvelle clé à chaque coup de tampon : l'animation repart.
            key={stamp.count}
            size="small"
            icon={draft ? <LockOpenIcon /> : <LockIcon />}
            color={draft ? 'warning' : 'default'}
            label={status}
            sx={
              stamp.count > 0
                ? {
                    animation: `oniria-stamp 300ms ${EASE} both`,
                    '@media (prefers-reduced-motion: reduce)': {
                      animation: 'oniria-fade 200ms ease-out both',
                    },
                  }
                : undefined
            }
          />
          <Box
            aria-hidden
            sx={{ flex: 1, minWidth: 24, height: '1px', bgcolor: 'rule' }}
          />
        </Box>
        <Typography
          variant="caption"
          color="textSecondary"
          component="p"
          sx={{ mb: 1.5 }}
        >
          Investie dans les caractères : {computed.characteristicsCost} XP (1 XP
          par point jusqu’à 25, 2 jusqu’à 50, 4 jusqu’à 75, 8 au-delà).
        </Typography>

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
                draft={points.plan.spending[pool.key]}
              />
            </Grid>
          ))}
        </Grid>
        <XpBarLegend parts={legend} />

        {creationAt !== null && (
          // La création en trois temps : on sait toujours quoi faire ensuite
          // (et qui doit le faire), sans alerte tant que l'XP n'est pas là.
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>Créer la fiche en trois temps</AlertTitle>
            <CreationSteps
              step={creationAt}
              details={{
                1:
                  creationAt === 1 ? (
                    isAdmin ? (
                      <Button size="small" onClick={() => setGrantOpen(true)}>
                        Attribuer l&apos;XP de création
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        En attente du MJ.
                      </Typography>
                    )
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Reçue{'\u00a0'}: {formatAmounts(xp.gained)}.
                    </Typography>
                  ),
                2: creationAt === 2 && (
                  <Typography variant="body2" sx={{ color: 'warning.main' }}>
                    Il manque {missing}
                    {'\u00a0'}XP{'\u00a0'}:{' '}
                    {Object.entries(xp.missingByScope)
                      .map(([s, m]) => `${SCOPE_BY_KEY[s as Scope].label} ${m}`)
                      .join(', ')}
                    .
                  </Typography>
                ),
                3: creationAt === 3 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      columnGap: 2,
                      rowGap: 0.5,
                    }}
                  >
                    <Typography variant="body2">
                      {due === 0
                        ? 'Rien à payer.'
                        : `À payer\u00a0: ${due}\u00a0XP (${formatAmounts(xp.allocation.total)}).`}
                    </Typography>
                    {canEdit && (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={waiting}
                        onClick={() => setConfirmValidate(true)}
                      >
                        Valider la fiche
                      </Button>
                    )}
                  </Box>
                ),
              }}
            />
            {waiting && (
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                Ces montants comptent les points en attente : valide-les ou
                annule-les avant de valider la fiche.
              </Typography>
            )}
          </Alert>
        )}

        {draft && !creation && (
          <Alert
            severity={xp.allocation.feasible ? 'info' : 'warning'}
            sx={{ mt: 2 }}
            action={
              canEdit && (
                <Button
                  color="inherit"
                  size="small"
                  disabled={!xp.allocation.feasible || waiting}
                  onClick={() => setConfirmValidate(true)}
                >
                  Valider
                </Button>
              )
            }
          >
            <AlertTitle>
              Reset : {scopeList(xp.unlocked)} se modifie librement
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
            {waiting && (
              <>
                {' '}
                Ces montants comptent les points en attente : validez-les ou
                annulez-les avant de valider la fiche.
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
      </Box>

      <Dialog
        open={confirmValidate}
        onClose={validating ? undefined : () => setConfirmValidate(false)}
      >
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
          <Button
            onClick={() => setConfirmValidate(false)}
            disabled={validating}
          >
            Annuler
          </Button>
          <BusyButton
            variant="contained"
            busy={validating}
            onClick={async () => {
              setValidating(true);
              const ok = await validate();
              setValidating(false);
              if (ok) setConfirmValidate(false);
            }}
          >
            Valider
          </BusyButton>
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
    </Box>
  );
};

export default ExperienceCard;
