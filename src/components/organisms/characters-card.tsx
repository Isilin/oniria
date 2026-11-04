'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTICS, characteristicCost, GROUPS } from '@/lib/rules';
import { CHARACTERISTIC_MAX } from '@/lib/rules/xp';
import { Box, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import PreviewValue from '../atoms/preview-value';
import ScopeLock from '../atoms/scope-lock';
import PointStepper from '../molecules/point-stepper';
import SectionCard from '../molecules/section-card';
import StatRow from '../molecules/stat-row';

/** Prix du prochain point : 1 jusqu'à 25, 2 jusqu'à 50, 4 jusqu'à 75, puis 8. */
const nextPointCost = (value: number) =>
  value >= CHARACTERISTIC_MAX
    ? null
    : characteristicCost(value + 1) - characteristicCost(value);

/**
 * Les Caractères, en grand : la valeur que l'on cherche du regard en jeu.
 * Les points s'ajoutent un par un, en aperçu, avant d'être validés (barre
 * des points en attente).
 */
const CharactersCard = ({ id }: { id: string }) => {
  const { computed, base, canEdit, isLocked, points } = useSheet(id);

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
        {GROUPS.map((group) => {
          const total = computed.groups[group.key];
          const cost = computed.groupCosts[group.key];
          return (
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
                  title={`Expérience investie : ${cost} XP${
                    cost !== base.groupCosts[group.key]
                      ? ` (avant : ${base.groupCosts[group.key]} XP)`
                      : ''
                  }`}
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
                    <PreviewValue
                      before={base.groups[group.key]}
                      delta={total - base.groups[group.key]}
                    >
                      {total}
                    </PreviewValue>
                  </Typography>
                </Tooltip>
              </Box>
              {CHARACTERISTICS.filter((c) => c.group === group.key).map((c) => {
                const value = computed.values[c.key];
                const pending = value - base.values[c.key];
                const { min, max } = points.bounds(c.key);
                const next = nextPointCost(value);
                return (
                  <StatRow
                    key={c.key}
                    label={c.label}
                    tooltip={`${c.description} (valeur : ${characteristicCost(value)} XP${
                      next !== null ? ` ; point suivant : ${next} XP` : ''
                    })`}
                    after={
                      canEdit ? (
                        <PointStepper
                          label={c.label}
                          points={pending}
                          canAdd={value < max}
                          canRemove={value > min}
                          onStep={(step) => points.step(c.key, step)}
                        />
                      ) : undefined
                    }
                  >
                    <Typography variant="numeral" sx={{ fontSize: '1.375rem' }}>
                      <PreviewValue before={base.values[c.key]} delta={pending}>
                        {value}
                      </PreviewValue>
                    </Typography>
                  </StatRow>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </SectionCard>
  );
};

export default CharactersCard;
