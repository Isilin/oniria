'use no memo';

import { Link, Text, View } from '@react-pdf/renderer';
import { formatAmounts, xpListChip } from '@/lib/sheet/display';
import { type SheetModel, sheetName } from '../model';
import { Chip, SectionHeading } from '../primitives';
import { INK, s } from '../styles';
import { pdfText } from '../text';

/** Ancre d'une fiche dans le PDF d'une table (liens de la vue d'ensemble). */
export const sheetAnchor = (id: string) => `sheet-${id}`;

const COLUMNS: { label: string; width?: number }[] = [
  { label: 'Personnage' },
  { label: 'Santé', width: 38 },
  { label: 'Équilibre', width: 44 },
  { label: 'Éclat', width: 36 },
  { label: 'Maï', width: 30 },
  { label: 'Init.', width: 28 },
  { label: 'Prot.', width: 30 },
  { label: 'Enc.', width: 30 },
  { label: 'Dég.', width: 26 },
  { label: 'XP restante', width: 92 },
];

const cell = (index: number) =>
  COLUMNS[index].width
    ? { width: COLUMNS[index].width, paddingHorizontal: 2 }
    : { flexGrow: 1, flexBasis: 0, paddingHorizontal: 2 };

const Gauge = ({
  current,
  max,
  threshold,
}: {
  current: number | null;
  max: number;
  threshold?: number;
}) => (
  <View>
    <Text style={[s.body, { fontSize: 8 }]}>{`${current ?? max}/${max}`}</Text>
    {threshold !== undefined && (
      <Text
        style={[s.caption, { fontSize: 6 }]}
      >{`seuil\u00a0${threshold}`}</Text>
    )}
  </View>
);

const MemberRow = ({ model }: { model: SheetModel }) => {
  const { sheet, computed: c, xp } = model;
  const chip = xpListChip(xp);
  return (
    <View
      wrap={false}
      style={[{ flexDirection: 'row', paddingVertical: 3 }, s.hairline]}
    >
      <View style={cell(0)}>
        <Link
          src={`#${sheetAnchor(sheet.id)}`}
          style={{ textDecoration: 'none' }}
        >
          <Text style={[s.hand, { fontSize: 12 }]}>
            {pdfText(sheetName(sheet))}
          </Text>
        </Link>
        <Text style={[s.caption, { fontSize: 6.5 }]}>
          {pdfText(sheet.user?.name)}
        </Text>
      </View>
      <View style={cell(1)}>
        <Gauge
          current={sheet.current_health}
          max={c.health}
          threshold={c.healthThreshold}
        />
      </View>
      <View style={cell(2)}>
        <Gauge
          current={sheet.current_stability}
          max={c.stability}
          threshold={c.stabilityThreshold}
        />
      </View>
      <View style={cell(3)}>
        <Gauge
          current={sheet.current_radiance}
          max={c.radiance}
          threshold={c.radianceThreshold}
        />
      </View>
      <View style={cell(4)}>
        <Gauge current={sheet.current_mai} max={c.mai} />
      </View>
      <Text style={[s.body, { fontSize: 8 }, cell(5)]}>{c.initiative}</Text>
      <Text style={[s.body, { fontSize: 8 }, cell(6)]}>
        {c.protection.max ? `${c.protection.current}/${c.protection.max}` : '-'}
      </Text>
      <Text
        style={[s.body, { fontSize: 8 }, cell(7)]}
      >{`${c.bulk}\u00a0%`}</Text>
      <Text style={[s.body, { fontSize: 8 }, cell(8)]}>{c.damage}</Text>
      <View style={cell(9)}>
        <Text style={[s.body, { fontSize: 7.5 }]}>
          {formatAmounts(xp.left)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            marginTop: 1,
          }}
        >
          {chip && <Chip label={chip} color={INK.warning} />}
          {xp.consistency.diff !== 0 && (
            <Chip label="écart" color={INK.error} />
          )}
        </View>
      </View>
    </View>
  );
};

/** Page de garde d'une table : son nom, et la vue d'ensemble du MJ. */
export const TeamCover = ({
  name,
  models,
  exportedAt,
}: {
  name: string;
  models: SheetModel[];
  exportedAt: Date;
}) => (
  <View>
    <View style={{ alignItems: 'center', marginTop: 18, marginBottom: 26 }}>
      <Text style={s.label}>Table de jeu</Text>
      <Text style={[s.hand, { fontSize: 32, fontWeight: 700, marginTop: 4 }]}>
        {pdfText(name)}
      </Text>
      <Text style={[s.body, { marginTop: 4 }]}>
        {models.length === 1 ? '1 personnage' : `${models.length} personnages`}
      </Text>
      <Text style={[s.caption, { marginTop: 2 }]}>
        {`Exportée le ${exportedAt.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Europe/Paris',
        })}`}
      </Text>
    </View>
    <SectionHeading title="Vue d’ensemble" />
    <View style={[{ flexDirection: 'row', paddingBottom: 2 }, s.groupRule]}>
      {COLUMNS.map((column, i) => (
        <Text
          key={column.label}
          style={[s.label, { fontSize: 6, letterSpacing: 0.3 }, cell(i)]}
        >
          {column.label}
        </Text>
      ))}
    </View>
    {models.map((model) => (
      <MemberRow key={model.sheet.id} model={model} />
    ))}
    <Text style={[s.caption, { marginTop: 6 }]}>
      {
        'Init.\u00a0: Initiative · Prot.\u00a0: Protection · Enc.\u00a0: Encombrement · Dég.\u00a0: Dégâts.'
      }
    </Text>
    <Text style={[s.caption, { marginTop: 2 }]}>
      {'écart\u00a0: le compte d’XP de la fiche n’est pas bon (voir sa fiche).'}
    </Text>
  </View>
);
