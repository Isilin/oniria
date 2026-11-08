'use no memo';

import { Text, View } from '@react-pdf/renderer';
import type { SheetModel } from '../model';
import { Planet } from '../ornaments';
import { EXISTENCE, INK, s, SIZE } from '../styles';

interface Gauge {
  label: string;
  current: number;
  max: number;
  threshold?: number;
  color: string;
  small?: boolean;
}

const MAI_GROW = 2.3;

const Cell = ({ gauge, last }: { gauge: Gauge; last?: boolean }) => (
  <View
    style={{
      flexGrow: gauge.small ? MAI_GROW : 3,
      flexBasis: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 7,
      ...(last ? {} : { borderRightWidth: 0.6, borderRightColor: INK.print }),
    }}
  >
    <Planet
      current={gauge.current}
      max={gauge.max}
      color={gauge.color}
      small={gauge.small}
    />
    <View style={{ marginLeft: 5, flexShrink: 1 }}>
      {/* Le Maï n'a pas de libellé : la légende au-dessus le porte. */}
      {!gauge.small && (
        <Text style={[s.label, { fontSize: 6.5, letterSpacing: 0.6 }]}>
          {gauge.label}
        </Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text
          style={[
            s.handValue,
            { fontSize: SIZE.handExistence, lineHeight: 0.95 },
          ]}
        >
          {gauge.current}
        </Text>
        <Text
          style={[s.caption, { fontSize: 8, marginLeft: 2, marginBottom: 2 }]}
        >
          {`/\u00a0${gauge.max}`}
        </Text>
      </View>
      {gauge.threshold !== undefined && (
        <Text style={s.caption}>{`seuil\u00a0${gauge.threshold}`}</Text>
      )}
    </View>
  </View>
);

const Caption = ({ label, grow }: { label: string; grow: number }) => (
  <View
    style={{
      flexGrow: grow,
      flexBasis: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 7,
    }}
  >
    <Text style={[s.label, { marginRight: 5 }]}>{label}</Text>
    <View
      style={{
        flexGrow: 1,
        borderBottomWidth: 0.6,
        borderBottomColor: INK.print,
      }}
    />
  </View>
);

/**
 * L'encadré des Existences : La Santé, L'Équilibre, L'Éclat (maximum et
 * seuil), et le Maï, en planètes. La valeur courante est écrite à la main.
 */
export const Existences = ({ model }: { model: SheetModel }) => {
  const { sheet, computed } = model;
  const gauges: Gauge[] = [
    {
      label: 'La Santé',
      current: sheet.current_health ?? computed.health,
      max: computed.health,
      threshold: computed.healthThreshold,
      color: EXISTENCE.health,
    },
    {
      label: "L'Équilibre",
      current: sheet.current_stability ?? computed.stability,
      max: computed.stability,
      threshold: computed.stabilityThreshold,
      color: EXISTENCE.stability,
    },
    {
      label: "L'Éclat",
      current: sheet.current_radiance ?? computed.radiance,
      max: computed.radiance,
      threshold: computed.radianceThreshold,
      color: EXISTENCE.radiance,
    },
    {
      label: 'Maï',
      current: sheet.current_mai ?? computed.mai,
      max: computed.mai,
      color: EXISTENCE.mai,
      small: true,
    },
  ];
  return (
    <View
      wrap={false}
      style={{
        borderWidth: 1.1,
        borderColor: INK.print,
        paddingVertical: 6,
        marginBottom: 14,
      }}
    >
      <View style={{ flexDirection: 'row', marginBottom: 3 }}>
        <Caption label="Existences" grow={9} />
        <Caption label="Maï" grow={MAI_GROW} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {gauges.map((gauge, i) => (
          <Cell
            key={gauge.label}
            gauge={gauge}
            last={i === gauges.length - 1}
          />
        ))}
      </View>
    </View>
  );
};
