'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import PreviewValue from '../atoms/preview-value';
import SectionCard from '../molecules/section-card';
import StatRow from '../molecules/stat-row';

type Derived = 'damage' | 'initiative' | 'impact' | 'impulsion' | 'conduction';

/** Les valeurs de combat, en colonne à côté des Caractères. */
const CombatCard = ({ id }: { id: string }) => {
  const { computed, base } = useSheet(id);

  /** Valeur dérivée des caractères, en aperçu tant que des points attendent. */
  const derived = (key: Derived) => (
    <PreviewValue before={base[key]} delta={computed[key] - base[key]}>
      {computed[key]}
    </PreviewValue>
  );

  const rows: { label: string; value: ReactNode; tooltip: string }[] = [
    { label: 'Dégâts', value: derived('damage'), tooltip: '(Force / 10) - 5' },
    {
      label: 'Initiative',
      value: derived('initiative'),
      tooltip: 'Vivacité / 10',
    },
    {
      label: 'Impact',
      value: derived('impact'),
      tooltip: 'Raisonnement / 10',
    },
    {
      label: 'Impulsion',
      value: derived('impulsion'),
      tooltip: 'Perception / 10',
    },
    {
      label: 'Conduction',
      value: derived('conduction'),
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
          <Typography variant="numeral" sx={{ fontSize: '0.9375rem' }}>
            {row.value}
          </Typography>
        </StatRow>
      ))}
    </SectionCard>
  );
};

export default CombatCard;
