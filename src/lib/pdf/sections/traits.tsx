'use no memo';

import { Text, View } from '@react-pdf/renderer';
import type { SheetModel } from '../model';
import { PdfTable, Section } from '../primitives';
import { INK, s } from '../styles';

type Trait = SheetModel['sheet']['traits'][number];

/** Traits innés (et leur équilibre) puis traits acquis. */
export const Traits = ({ model }: { model: SheetModel }) => {
  const { sheet, computed } = model;
  const balance = computed.inbornTraitsBalance;
  return (
    <View break>
      <Section title="Traits innés">
        <PdfTable<Trait>
          rows={sheet.traits.filter((t) => t.inborn)}
          empty="Aucun trait inné."
          columns={[
            { label: 'Trait', weight: 2, hand: true, value: (t) => t.name },
            {
              label: 'Balance',
              width: 48,
              align: 'right',
              hand: true,
              value: (t) => t.balance,
            },
            {
              label: 'Description',
              weight: 4,
              hand: true,
              value: (t) => t.description,
            },
          ]}
        />
        <View
          style={{
            marginTop: 5,
            borderLeftWidth: 1.5,
            borderLeftColor: balance === 0 ? INK.success : INK.warning,
            paddingLeft: 6,
          }}
          wrap={false}
        >
          <Text
            style={[
              s.body,
              { color: balance === 0 ? INK.success : INK.warning },
            ]}
          >
            {`Équilibre des traits innés\u00a0: ${balance > 0 ? `+${balance}` : balance}${
              balance !== 0
                ? ' (dans les fiches existantes, les traits innés totalisent 0)'
                : ''
            }`}
          </Text>
        </View>
      </Section>
      <Section title="Traits acquis">
        <Text style={[s.caption, { marginBottom: 4 }]}>
          Séquelles, renommée, faveurs divines, objets marquants… gagnés en
          cours de jeu.
        </Text>
        <PdfTable<Trait>
          rows={sheet.traits.filter((t) => !t.inborn)}
          empty="Aucun trait acquis."
          columns={[
            { label: 'Trait', weight: 2, hand: true, value: (t) => t.name },
            {
              label: 'Description',
              weight: 5,
              hand: true,
              value: (t) => t.description,
            },
          ]}
        />
      </Section>
    </View>
  );
};
