'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTICS, characteristicCost, GROUPS } from '@/lib/rules';
import { CHARACTERISTIC_MAX } from '@/lib/rules/xp';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import EditableField from '../atoms/editable-field';
import ScopeLock from '../atoms/scope-lock';
import SectionCard from '../molecules/section-card';
import StatRow from '../molecules/stat-row';

/** Prix du prochain point : 1 jusqu'à 25, 2 jusqu'à 50, 4 jusqu'à 75, puis 8. */
const nextPointCost = (value: number) =>
  value >= CHARACTERISTIC_MAX
    ? null
    : characteristicCost(value + 1) - characteristicCost(value);

/** Les Caractères, en grand : la valeur que l'on cherche du regard en jeu. */
const CharactersCard = ({ id }: { id: string }) => {
  const { sheet, computed, canEdit, update, isLocked } = useSheet(id);

  return (
    <SectionCard title="Caractères" section="characters">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(156px, 1fr))',
          columnGap: 2,
          rowGap: 2,
        }}
      >
        {GROUPS.map((group) => (
          <Box key={group.key} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 0.5,
                pb: 0.75,
                mb: 0.25,
                borderBottom: 1,
                borderColor: 'text.secondary',
              }}
            >
              <Typography variant="h5" component="h3">
                {group.label}
              </Typography>
              <ScopeLock locked={isLocked(group.key)} />
              <Typography
                variant="numeral"
                sx={{ ml: 'auto', fontSize: '1.75rem', fontStyle: 'italic' }}
              >
                {computed.groups[group.key]}
              </Typography>
            </Box>
            {CHARACTERISTICS.filter((c) => c.group === group.key).map((c) => {
              const value = computed.values[c.key];
              const next = nextPointCost(value);
              return (
                <StatRow
                  key={c.key}
                  label={c.label}
                  tooltip={`${c.description} (valeur : ${characteristicCost(value)} XP${
                    next !== null ? ` ; point suivant : ${next} XP` : ''
                  })`}
                >
                  <Box component="span" sx={{ fontSize: '1.375rem' }}>
                    <EditableField
                      value={sheet[c.key]}
                      type="number"
                      variant="numeral"
                      aria-label={c.label}
                      editable={canEdit}
                      onChange={(v) => update({ [c.key]: Number(v) })}
                    />
                  </Box>
                </StatRow>
              );
            })}
            <Typography
              variant="caption"
              color="textSecondary"
              component="p"
              sx={{ mt: 0.5 }}
            >
              Exp. : {computed.groupCosts[group.key]}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        variant="caption"
        color="textSecondary"
        component="p"
        sx={{ mt: 1.5 }}
      >
        Expérience investie dans les caractères : {computed.characteristicsCost}{' '}
        (1 XP par point jusqu’à 25, 2 jusqu’à 50, 4 jusqu’à 75, 8 au-delà)
      </Typography>
    </SectionCard>
  );
};

export default CharactersCard;
