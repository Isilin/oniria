'use no memo';

import { Text, View } from '@react-pdf/renderer';
import type { CharacteristicValues } from '@/lib/rules';
import { armorTypeLabel, prerequisiteOf } from '@/lib/sheet/display';
import type { SheetModel } from '../model';
import { WarnIcon } from '../ornaments';
import {
  Chip,
  type Column,
  Hand,
  PdfTable,
  Section,
  TYPED_CELL_OFFSET,
  Worn,
} from '../primitives';
import { INK, s } from '../styles';

type Sheet = SheetModel['sheet'];
type Melee = Sheet['meleeWeapons'][number];
type Range = Sheet['rangeWeapons'][number];
type Armor = Sheet['armors'][number];
type Item = Sheet['items'][number];
type Equipment = Melee | Range | Armor;

/** Prérequis tapé (« For 40 »), avec un avertissement s'il n'est pas rempli. */
const Prerequisite = ({
  row,
  values,
}: {
  row: Equipment;
  values: CharacteristicValues;
}) => {
  const { stat, text, met, current } = prerequisiteOf(row, values);
  return (
    <View style={{ paddingTop: TYPED_CELL_OFFSET }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={[s.body, { fontSize: 7.5 }, stat ? {} : { color: INK.pale }]}
        >
          {text}
        </Text>
        {!met && stat && (
          <View style={{ marginLeft: 2 }}>
            <WarnIcon />
          </View>
        )}
      </View>
      {!met && stat && (
        <Text style={[s.caption, { fontSize: 6, color: INK.warning }]}>
          {`${stat.label} insuffisante (${current}\u00a0/\u00a0${row.prerequisite_value})`}
        </Text>
      )}
    </View>
  );
};

/** Propriétés de l'équipement, en puces tapées. */
const Properties = ({ row }: { row: Equipment }) =>
  row.properties.length === 0 ? (
    <Text
      style={[
        s.body,
        { fontSize: 7.5, color: INK.pale, paddingTop: TYPED_CELL_OFFSET },
      ]}
    >
      -
    </Text>
  ) : (
    <View
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, paddingTop: 2 }}
    >
      {row.properties.map((p) => (
        <Chip key={p.id} label={p.name ?? '?'} />
      ))}
    </View>
  );

const worn = <T extends Equipment>(): Column<T> => ({
  label: 'Porté',
  width: 24,
  render: (row) => <Worn worn={row.equipped} />,
});

const number = <T,>(
  label: string,
  value: (row: T) => unknown,
  width = 36,
): Column<T> => ({ label, width, align: 'right', hand: true, value });

/** Une arme de tir : un bloc, ses quinze valeurs sur deux lignes. */
const RangeWeapon = ({
  row,
  values,
}: {
  row: Range;
  values: CharacteristicValues;
}) => {
  // Le prérequis se dessine à part (avertissement s'il n'est pas rempli).
  const PREREQUISITE = Symbol('prérequis');
  const cells: [string, unknown][][] = [
    [
      ['Dégâts', row.damage],
      ['Pénétration', row.penetration_damage],
      ['Vélocité', row.velocity],
      ['Cadence', row.rate],
      ['Recharg.', row.reload_rate],
      ['Courte', row.low_range],
    ],
    [
      ['Moyenne', row.medium_range],
      ['Longue', row.long_range],
      ['Enc. (%)', row.bulk],
      ['Solidité', row.solidity],
      ['Prérequis', PREREQUISITE],
      ['Qualité', row.quality],
    ],
  ];
  return (
    <View wrap={false} style={[{ paddingVertical: 4 }, s.hairline]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Worn worn={row.equipped} />
        <Text style={[s.caption, { marginLeft: 3, marginRight: 8 }]}>
          Porté
        </Text>
        <Hand value={row.name} style={{ fontSize: 13 }} />
      </View>
      {cells.map((line, l) => (
        <View key={l} style={{ flexDirection: 'row', marginTop: 2 }}>
          {line.map(([label, value]) => (
            <View key={label} style={{ flexGrow: 1, flexBasis: 0 }}>
              <Text style={[s.label, { fontSize: 6, letterSpacing: 0.4 }]}>
                {label}
              </Text>
              {value === PREREQUISITE ? (
                <Prerequisite row={row} values={values} />
              ) : (
                <Hand value={value} style={{ fontSize: 11 }} />
              )}
            </View>
          ))}
        </View>
      ))}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}
      >
        <Text
          style={[s.label, { fontSize: 6, letterSpacing: 0.4, marginRight: 5 }]}
        >
          Propriétés
        </Text>
        <Properties row={row} />
      </View>
    </View>
  );
};

/**
 * Inventaire : ce que l'équipement porté donne au combat, puis les armes,
 * les armures et les objets.
 */
export const Inventory = ({ model }: { model: SheetModel }) => {
  const { sheet, computed } = model;
  const values = computed.values;
  const prerequisite = <T extends Equipment>(): Column<T> => ({
    label: 'Prérequis',
    width: 58,
    render: (row) => <Prerequisite row={row} values={values} />,
  });
  const properties = <T extends Equipment>(): Column<T> => ({
    label: 'Propriétés',
    weight: 1.6,
    render: (row) => <Properties row={row} />,
  });
  const summary: [string, string | number][] = [
    ['Dégâts (Force)', computed.damage],
    [
      'Protection',
      computed.protection.max
        ? `${computed.protection.current}/${computed.protection.max}`
        : '-',
    ],
    ['Encombrement', `${computed.bulk}\u00a0%`],
  ];

  return (
    <View>
      <Section title="Inventaire">
        <View style={{ flexDirection: 'row' }} wrap={false}>
          {summary.map(([label, value]) => (
            <View key={label} style={{ marginRight: 22 }}>
              <Text style={s.label}>{label}</Text>
              <Text style={s.numeral}>{value}</Text>
            </View>
          ))}
        </View>
      </Section>
      <Section title="Armes de mêlée">
        <PdfTable<Melee>
          rows={sheet.meleeWeapons}
          empty="Aucune arme de mêlée."
          columns={[
            worn(),
            { label: 'Nom', weight: 2, hand: true, value: (w) => w.name },
            number('Dégâts', (w) => w.damage),
            number('Allonge', (w) => w.extend),
            number('Enc. (%)', (w) => w.bulk),
            number('Solidité', (w) => w.solidity),
            prerequisite(),
            properties(),
            number('Qualité', (w) => w.quality),
          ]}
        />
      </Section>
      <Section title="Armes de tir">
        {sheet.rangeWeapons.length === 0 ? (
          <Text style={s.empty}>Aucune arme de tir.</Text>
        ) : (
          sheet.rangeWeapons.map((row) => (
            <RangeWeapon key={row.id} row={row} values={values} />
          ))
        )}
      </Section>
      <Section title="Armures">
        <PdfTable<Armor>
          rows={sheet.armors}
          empty="Aucune armure."
          columns={[
            worn(),
            { label: 'Nom', weight: 2, hand: true, value: (a) => a.name },
            number(
              'Protection',
              (a) => a.current_protection ?? a.protection,
              40,
            ),
            number('Max', (a) => a.protection, 26),
            number('Indice', (a) => a.index, 28),
            {
              label: 'Type',
              width: 40,
              value: (a) => (a.type ? armorTypeLabel(a.type) : null),
            },
            number('Enc. (%)', (a) => a.bulk),
            number('Solidité', (a) => a.solidity),
            prerequisite(),
            properties(),
            number('Qualité', (a) => a.quality),
          ]}
        />
      </Section>
      <Section title="Objets">
        <PdfTable<Item>
          rows={sheet.items}
          empty="Besace vide."
          columns={[
            { label: 'Objet', weight: 2, hand: true, value: (i) => i.name },
            number('Quantité', (i) => i.quantity, 44),
            {
              label: 'Notes',
              weight: 4,
              hand: true,
              value: (i) => i.description,
            },
          ]}
        />
      </Section>
    </View>
  );
};
