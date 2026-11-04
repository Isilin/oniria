'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { Alert, Box, Typography } from '@mui/material';
import SectionCard from '../molecules/section-card';
import SheetCollection from './sheet-collection';

const TraitsTab = ({ id }: { id: string }) => {
  const { computed } = useSheet(id);
  const balance = computed.inbornTraitsBalance;

  return (
    // Deux sections de la feuille, comme l'onglet Caractéristiques : pas de
    // cartes, un titre frappé et son filet.
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '100%',
        pt: 2,
      }}
    >
      <SectionCard title="Traits innés">
        <SheetCollection
          id={id}
          collection="traits"
          filter={(t) => t.inborn}
          defaults={{ inborn: true, balance: 0 }}
          addLabel="Ajouter un trait inné"
          emptyLabel="Aucun trait inné."
          columns={[
            { key: 'name', label: 'Trait' },
            {
              key: 'balance',
              label: 'Balance',
              type: 'number',
              width: 100,
              tooltip:
                'Positif pour un avantage, négatif pour un défaut. Les traits innés se compensent.',
            },
            { key: 'description', label: 'Description', type: 'multiline' },
          ]}
          footer={
            <Alert severity={balance === 0 ? 'success' : 'warning'}>
              Équilibre des traits innés :{' '}
              {balance > 0 ? `+${balance}` : balance}
              {balance !== 0 &&
                ' (dans les fiches existantes, les traits innés totalisent 0)'}
            </Alert>
          }
        />
      </SectionCard>
      <SectionCard title="Traits acquis">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Séquelles, renommée, faveurs divines, objets marquants… gagnés en
          cours de jeu.
        </Typography>
        <SheetCollection
          id={id}
          collection="traits"
          filter={(t) => !t.inborn}
          defaults={{ inborn: false }}
          addLabel="Ajouter un trait acquis"
          emptyLabel="Aucun trait acquis."
          columns={[
            { key: 'name', label: 'Trait' },
            { key: 'description', label: 'Description', type: 'multiline' },
          ]}
        />
      </SectionCard>
    </Box>
  );
};

export default TraitsTab;
