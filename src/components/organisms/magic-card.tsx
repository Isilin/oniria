'use client';

import Box from '@mui/material/Box';
import SectionCard from '../molecules/section-card';
import SheetCollection from './sheet-collection';

/** Sortilèges et Golems : deux sections côte à côte sur grand écran. */
const MagicCard = ({ id }: { id: string }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 4,
      gridTemplateColumns: {
        xs: 'minmax(0, 1fr)',
        lg: 'minmax(0, 7fr) minmax(0, 5fr)',
      },
    }}
  >
    <SectionCard title="Sortilèges">
      <SheetCollection
        id={id}
        collection="spells"
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
    </SectionCard>
    <SectionCard title="Golem">
      <SheetCollection
        id={id}
        collection="golems"
        addLabel="Ajouter un golem"
        emptyLabel="Aucun golem."
        columns={[
          { key: 'name', label: 'Nom' },
          { key: 'artefact', label: 'Artefact', type: 'multiline' },
          { key: 'symbiosis', label: 'Symbiose', type: 'multiline' },
          { key: 'heart', label: 'Cœur', type: 'multiline' },
        ]}
      />
    </SectionCard>
  </Box>
);

export default MagicCard;
