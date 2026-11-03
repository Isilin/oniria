'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTIC_BY_KEY } from '@/lib/rules';
import { SCOPE_BY_KEY, Scope } from '@/lib/rules/xp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const signed = (value: number) => (value > 0 ? `+${value}` : `−${-value}`);

/**
 * Points en attente sur les caractères : ce qu'ils coûtent, et de quoi les
 * valider ou les annuler. Reste en bas de l'écran pendant qu'on parcourt
 * l'aperçu du reste de la fiche.
 */
const PointsBar = ({ id }: { id: string }) => {
  const { points, isAdmin } = useSheet(id);
  const [saving, setSaving] = useState(false);
  const { plan } = points;
  if (!plan || plan.lines.length === 0) return null;

  const taken = plan.removals.reduce((t, r) => t - r.line.delta, 0);
  const details = [
    plan.cost > 0 && `Coût : ${plan.cost} XP`,
    taken > 0 && `reprise : ${taken} XP`,
    plan.freeCost !== 0 &&
      `${signed(plan.freeCost)} XP à payer à la validation de la fiche`,
  ].filter(Boolean);
  const missing =
    plan.missing > 0 &&
    `XP insuffisante : il manque ${plan.missing} XP (${Object.entries(
      plan.missingByScope,
    )
      .map(([s, m]) => `${SCOPE_BY_KEY[s as Scope].label} ${m}`)
      .join(', ')}).${isAdmin ? ' Le MJ peut les offrir.' : ''}`;

  const commit = async () => {
    setSaving(true);
    await points.commit();
    setSaving(false);
  };

  return (
    <Paper
      role="region"
      aria-label="Points en attente"
      elevation={8}
      sx={{
        position: 'sticky',
        bottom: 16,
        zIndex: 'appBar',
        width: '100%',
        p: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        border: 1,
        borderColor: missing ? 'error.main' : 'success.main',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {plan.lines
            .map(
              (l) =>
                `${CHARACTERISTIC_BY_KEY[l.key].label} ${signed(l.to - l.from)}`,
            )
            .join(' · ')}
        </Typography>
        <Typography
          variant="body2"
          color={missing ? 'error' : 'textSecondary'}
          aria-live="polite"
        >
          {missing || details.join(' · ')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        <Button onClick={points.clear} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={commit}
          disabled={saving || (!!missing && !isAdmin)}
        >
          Valider
        </Button>
      </Box>
    </Paper>
  );
};

export default PointsBar;
