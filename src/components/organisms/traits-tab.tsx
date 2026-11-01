'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { Alert, Box, Card, CardContent, Typography } from '@mui/material';
import SheetCollection from './sheet-collection';

const TraitsTab = ({ id }: { id: string }) => {
  const { computed } = useSheet(id);
  const balance = computed.inbornTraitsBalance;

  return (
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <Card>
        <CardContent>
          <SheetCollection
            id={id}
            collection="traits"
            title="Traits innés"
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
              <Alert
                severity={balance === 0 ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              >
                Équilibre des traits innés :{' '}
                {balance > 0 ? `+${balance}` : balance}
                {balance !== 0 &&
                  ' (dans les fiches existantes, les traits innés totalisent 0)'}
              </Alert>
            }
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <SheetCollection
            id={id}
            collection="traits"
            title="Traits acquis"
            filter={(t) => !t.inborn}
            defaults={{ inborn: false }}
            addLabel="Ajouter un trait acquis"
            emptyLabel="Aucun trait acquis."
            columns={[
              { key: 'name', label: 'Trait' },
              { key: 'description', label: 'Description', type: 'multiline' },
            ]}
          />
          <Typography variant="caption" color="textSecondary">
            Séquelles, renommée, faveurs divines, objets marquants… gagnés en
            cours de jeu.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TraitsTab;
