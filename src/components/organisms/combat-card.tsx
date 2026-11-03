'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { Typography } from '@mui/material';
import SectionCard from '../molecules/section-card';
import StatRow from '../molecules/stat-row';

/** Les valeurs de combat, en colonne à côté des Caractères. */
const CombatCard = ({ id }: { id: string }) => {
  const { computed } = useSheet(id);

  const rows = [
    { label: 'Dégâts', value: computed.damage, tooltip: '(Force / 10) - 5' },
    {
      label: 'Initiative',
      value: computed.initiative,
      tooltip: 'Vivacité / 10',
    },
    { label: 'Impact', value: computed.impact, tooltip: 'Raisonnement / 10' },
    {
      label: 'Impulsion',
      value: computed.impulsion,
      tooltip: 'Perception / 10',
    },
    {
      label: 'Conduction',
      value: computed.conduction,
      tooltip: 'Concentration / 10',
    },
    {
      label: 'Protection',
      value: computed.protection.max
        ? `${computed.protection.current} / ${computed.protection.max}`
        : '-',
      tooltip:
        'Armures équipées (onglet Inventaire) : protection actuelle / maximale',
    },
    {
      label: 'Encombrement',
      value: `${computed.bulk} %`,
      tooltip:
        "Somme de l'encombrement de l'équipement porté (onglet Inventaire). S'applique en malus au Coup Subtil et à l'Esquive.",
    },
  ];

  return (
    <SectionCard title="Combat" section="combat">
      {rows.map((row) => (
        <StatRow key={row.label} label={row.label} tooltip={row.tooltip}>
          <Typography variant="numeral" sx={{ fontSize: '1.0625rem' }}>
            {row.value}
          </Typography>
        </StatRow>
      ))}
    </SectionCard>
  );
};

export default CombatCard;
