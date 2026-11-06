'use no memo';

import { Text, View } from '@react-pdf/renderer';
import {
  CHARACTERISTICS,
  FACULTIES,
  FACULTY_COLUMNS,
  GROUPS,
} from '@/lib/rules';
import { formatSigned } from '@/lib/sheet/journal';
import type { SheetModel } from '../model';
import { GroupTitle, SectionHeading, StatRow } from '../primitives';
import { INK, s } from '../styles';

const COMBAT_WIDTH = 116;

/** Caractères : trois groupes de quatre, leur total et l'XP investie. */
const Characters = ({ model }: { model: SheetModel }) => {
  const { computed } = model;
  return (
    <View style={{ marginBottom: 12 }}>
      <SectionHeading title="Caractères" />
      <View style={{ flexDirection: 'row' }} wrap={false}>
        {GROUPS.map((group, i) => (
          <View
            key={group.key}
            style={{ flexGrow: 1, flexBasis: 0, marginLeft: i ? 10 : 0 }}
          >
            <GroupTitle
              title={group.label}
              right={
                <Text style={[s.total, { lineHeight: 1 }]}>
                  {computed.groups[group.key]}
                </Text>
              }
            />
            {CHARACTERISTICS.filter((c) => c.group === group.key).map((c) => (
              <StatRow key={c.key} label={c.label}>
                <Text style={s.handValue}>{computed.values[c.key]}</Text>
              </StatRow>
            ))}
            <Text style={[s.caption, { marginTop: 2 }]}>
              {`XP investie\u00a0: ${computed.groupCosts[group.key]}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/** Facultés : trois colonnes, la valeur tapée et sa marge. */
const Faculties = ({ model }: { model: SheetModel }) => {
  const { computed } = model;
  return (
    <View>
      <SectionHeading title="Facultés" />
      <View style={{ flexDirection: 'row' }} wrap={false}>
        {FACULTY_COLUMNS.map((column, i) => (
          <View
            key={column.key}
            style={{ flexGrow: 1, flexBasis: 0, marginLeft: i ? 10 : 0 }}
          >
            <GroupTitle title={column.label} />
            {FACULTIES.filter((f) => f.column === column.key).map((f) => {
              const { value, margin } = computed.faculties[f.key];
              return (
                <StatRow key={f.key} label={f.label}>
                  <Text style={s.numeral}>
                    {value}
                    {margin !== 0 && (
                      <Text style={[s.caption, { fontWeight: 400 }]}>
                        {` ${formatSigned(margin)}`}
                      </Text>
                    )}
                  </Text>
                </StatRow>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

/** Combat : les valeurs que les règles calculent pour la mêlée. */
const Combat = ({ model }: { model: SheetModel }) => {
  const { computed } = model;
  const rows: [string, string | number][] = [
    ['Dégâts', computed.damage],
    ['Initiative', computed.initiative],
    ['Impact', computed.impact],
    ['Impulsion', computed.impulsion],
    ['Conduction', computed.conduction],
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
      <SectionHeading title="Combat" />
      {rows.map(([label, value]) => (
        <StatRow key={label} label={label}>
          <Text style={s.numeral}>{value}</Text>
        </StatRow>
      ))}
    </View>
  );
};

/**
 * Ce qui sert en jeu, sur une page : Caractères et Facultés à gauche,
 * Combat dans une colonne étroite à droite, séparés par un filet.
 */
export const Play = ({ model }: { model: SheetModel }) => (
  <View style={{ flexDirection: 'row', marginBottom: 14 }} wrap={false}>
    <View style={{ flexGrow: 1, flexBasis: 0, paddingRight: 12 }}>
      <Characters model={model} />
      <Faculties model={model} />
    </View>
    <View
      style={{
        width: COMBAT_WIDTH,
        paddingLeft: 12,
        borderLeftWidth: 0.6,
        borderLeftColor: INK.print,
      }}
    >
      <Combat model={model} />
    </View>
  </View>
);
