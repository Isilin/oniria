'use no memo';

import { Text, View } from '@react-pdf/renderer';
import { type Amounts, POOLS } from '@/lib/rules/xp';
import {
  batchTitle,
  entryDate,
  entryDetail,
  formatSigned,
  groupEntries,
  JOURNAL_KINDS,
  signedAmounts,
  sumAmounts,
} from '@/lib/sheet/journal';
import type { SheetModel } from '../model';
import { Chip, Section } from '../primitives';
import { INK, s } from '../styles';
import { pdfText } from '../text';

type Entry = SheetModel['sheet']['xpEntries'][number];

const KIND_INKS = {
  success: INK.success,
  primary: INK.pen,
  info: INK.info,
  warning: INK.warning,
  secondary: INK.secondary,
};

const DATE_WIDTH = 52;
const AMOUNT_WIDTH = 46;
const AUTHOR_WIDTH = 70;

const Amount = ({ value }: { value: number }) => (
  <Text
    style={[
      s.numeral,
      {
        width: AMOUNT_WIDTH,
        textAlign: 'right',
        fontSize: 8,
        color: value > 0 ? INK.success : value < 0 ? INK.error : INK.print,
      },
    ]}
  >
    {formatSigned(value)}
  </Text>
);

const AmountCells = ({ amounts }: { amounts: Amounts }) => (
  <>
    {POOLS.map((p) => (
      <Amount key={p.key} value={amounts[p.key]} />
    ))}
  </>
);

const Row = ({
  date,
  children,
  amounts,
  author,
}: {
  date: string;
  children: React.ReactNode;
  amounts: Amounts;
  author: string;
}) => (
  <View
    wrap={false}
    style={[
      { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 2.2 },
      s.hairline,
    ]}
  >
    <Text style={[s.body, { width: DATE_WIDTH, fontSize: 7.5 }]}>{date}</Text>
    <View style={{ flexGrow: 1, flexBasis: 0, paddingRight: 4 }}>
      {children}
    </View>
    <AmountCells amounts={amounts} />
    <Text
      style={[
        s.caption,
        { width: AUTHOR_WIDTH, paddingLeft: 6, fontSize: 6.5 },
      ]}
    >
      {pdfText(author)}
    </Text>
  </View>
);

const EntryLabel = ({ entry }: { entry: Entry }) => {
  const kind = JOURNAL_KINDS[entry.kind];
  return (
    <View
      style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
    >
      <View style={{ marginRight: 4 }}>
        <Chip label={kind.label} color={KIND_INKS[kind.color]} />
      </View>
      <Text style={[s.body, { fontSize: 7.5, flexShrink: 1 }]}>
        {pdfText(entry.label)}
        <Text style={{ color: INK.pale }}>{entryDetail(entry)}</Text>
      </Text>
    </View>
  );
};

/**
 * L'historique de l'expérience, du plus récent au plus ancien ; les
 * écritures faites ensemble (validation, reset…) sous leur titre de lot.
 */
export const Journal = ({ model }: { model: SheetModel }) => {
  const { sheet, timeZone } = model;
  const date = (entry: Entry) => entryDate(entry, timeZone);
  return (
    <Section title="Historique de l’expérience">
      {sheet.xpEntries.length === 0 ? (
        <Text style={s.empty}>Aucune expérience pour le moment.</Text>
      ) : (
        <View>
          <View
            fixed
            style={[{ flexDirection: 'row', paddingBottom: 2 }, s.groupRule]}
          >
            {[
              ['Date', DATE_WIDTH],
              ['Écriture', 0],
              ...POOLS.map((p) => [p.label, AMOUNT_WIDTH] as const),
              ['Par', AUTHOR_WIDTH],
            ].map(([label, width]) => (
              <Text
                key={label}
                style={[
                  s.label,
                  { fontSize: 6.5, letterSpacing: 0.4 },
                  width
                    ? { width: Number(width) }
                    : { flexGrow: 1, flexBasis: 0 },
                  POOLS.some((p) => p.label === label)
                    ? { textAlign: 'right' }
                    : {},
                  label === 'Par' ? { paddingLeft: 6 } : {},
                ]}
              >
                {label}
              </Text>
            ))}
          </View>
          {groupEntries(sheet.xpEntries).map((group) =>
            group.length > 1 ? (
              <View key={group[0].id}>
                <Row
                  date={date(group[0])}
                  amounts={sumAmounts(group.map(signedAmounts))}
                  author={group[0].author?.name ?? ''}
                >
                  <Text style={[s.body, { fontSize: 7.5, fontWeight: 700 }]}>
                    {pdfText(batchTitle(group))}
                    <Text style={{ fontWeight: 400, color: INK.pale }}>
                      {` (${group.length} écritures)`}
                    </Text>
                  </Text>
                </Row>
                {group.map((entry) => (
                  <Row
                    key={entry.id}
                    date=""
                    amounts={signedAmounts(entry)}
                    author={entry.author?.name ?? ''}
                  >
                    <View style={{ paddingLeft: 12 }}>
                      <EntryLabel entry={entry} />
                    </View>
                  </Row>
                ))}
              </View>
            ) : (
              <Row
                key={group[0].id}
                date={date(group[0])}
                amounts={signedAmounts(group[0])}
                author={group[0].author?.name ?? ''}
              >
                <EntryLabel entry={group[0]} />
              </Row>
            ),
          )}
        </View>
      )}
    </Section>
  );
};
