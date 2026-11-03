'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTICS, characteristicCost, GROUPS } from '@/lib/rules';
import { CHARACTERISTIC_MAX } from '@/lib/rules/xp';
import { Box, Tooltip } from '@mui/material';
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
          // Trois colonnes fixes dès 520 px (demi-écran) : jamais de groupe
          // renvoyé sous un autre.
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          '@media (min-width: 520px)': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          },
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
              <Tooltip
                title={`Expérience investie : ${computed.groupCosts[group.key]} XP`}
                describeChild
              >
                <Typography
                  variant="numeral"
                  tabIndex={0}
                  sx={{
                    ml: 'auto',
                    fontSize: '1.75rem',
                    fontStyle: 'italic',
                    cursor: 'help',
                  }}
                >
                  {computed.groups[group.key]}
                </Typography>
              </Tooltip>
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
          </Box>
        ))}
      </Box>
    </SectionCard>
  );
};

export default CharactersCard;
