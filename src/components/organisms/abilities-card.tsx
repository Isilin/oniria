'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { CHARACTERISTIC_BY_KEY, FACULTIES, FACULTY_COLUMNS } from '@/lib/rules';
import { Box, Typography } from '@mui/material';
import PreviewValue from '../atoms/preview-value';
import SectionCard from '../molecules/section-card';
import StatRow from '../molecules/stat-row';

/** Les Facultés, en plus petit : une table serrée, trois colonnes. */
const AbilitiesCard = ({ id }: { id: string }) => {
  const { computed, base } = useSheet(id);

  return (
    <SectionCard title="Facultés" section="faculties">
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
        {FACULTY_COLUMNS.map((column) => (
          <Box key={column.key} sx={{ minWidth: 0 }}>
            <Typography
              variant="overline"
              component="h3"
              color="textSecondary"
              sx={{
                display: 'block',
                pb: 0.5,
                borderBottom: 1,
                borderColor: 'rule',
              }}
            >
              {column.label}
            </Typography>
            {FACULTIES.filter((f) => f.column === column.key).map((f) => {
              const major = CHARACTERISTIC_BY_KEY[f.major];
              const minor = CHARACTERISTIC_BY_KEY[f.minor];
              const now = computed.faculties[f.key];
              const before = base.faculties[f.key];
              return (
                <StatRow
                  key={f.key}
                  label={f.label}
                  after={
                    now.margin !== 0 ? (
                      <PreviewValue
                        before={`+${before.margin}`}
                        delta={now.margin - before.margin}
                      >
                        +{now.margin}
                      </PreviewValue>
                    ) : undefined
                  }
                  tooltip={
                    <>
                      <strong>
                        [{major.abbr} / {minor.abbr}]
                      </strong>{' '}
                      {`${major.label} + min(${major.label}, ${minor.label}). Marge : (${major.abbr} − 50) / 5, plus les bonus « ${major.abbr} +N » du Corpus.`}
                      {f.description && (
                        <>
                          <br />
                          <br />
                          {f.description}
                        </>
                      )}
                    </>
                  }
                >
                  <Typography variant="numeral" sx={{ fontSize: '1rem' }}>
                    <PreviewValue
                      before={before.value}
                      delta={now.value - before.value}
                    >
                      {now.value}
                    </PreviewValue>
                  </Typography>
                </StatRow>
              );
            })}
          </Box>
        ))}
      </Box>
    </SectionCard>
  );
};

export default AbilitiesCard;
