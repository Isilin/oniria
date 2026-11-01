'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import SheetCollection from './sheet-collection';

/** Sortilèges et Golems. */
const MagicCard = ({ id }: { id: string }) => (
  <Card>
    <CardContent>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SheetCollection
            id={id}
            collection="spells"
            title="Sortilèges"
            addLabel="Ajouter un sortilège"
            emptyLabel="Aucun sortilège."
            columns={[
              { key: 'name', label: 'Nom' },
              { key: 'incantation', label: 'Incantation' },
              { key: 'targeting', label: 'Ciblage' },
              { key: 'duration', label: 'Durée' },
              { key: 'effect', label: 'Effets', type: 'multiline' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <SheetCollection
            id={id}
            collection="golems"
            title="Golem"
            addLabel="Ajouter un golem"
            emptyLabel="Aucun golem."
            columns={[
              { key: 'name', label: 'Nom' },
              { key: 'artefact', label: 'Artefact', type: 'multiline' },
              { key: 'symbiosis', label: 'Symbiose', type: 'multiline' },
              { key: 'heart', label: 'Cœur', type: 'multiline' },
            ]}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default MagicCard;
