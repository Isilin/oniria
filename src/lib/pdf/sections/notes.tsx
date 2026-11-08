'use no memo';

import { Image as PdfImage, Link, Text, View } from '@react-pdf/renderer';
import { TYPE } from '../fonts';
import type { Inline, NoteBlock } from '../markdown';
import type { SheetModel } from '../model';
import { Checkbox, Fleuron } from '../ornaments';
import { Section } from '../primitives';
import { CONTENT_WIDTH, INK, s, SIZE } from '../styles';
import { pdfText } from '../text';

/**
 * Les notes, comme une page du carnet : écrites à la main, à l'encre bleue,
 * sur des lignes régulières ; 75 caractères par ligne au plus, les
 * tableaux et les images sur toute la largeur.
 */

const MEASURE = 390;
const LINE = SIZE.noteLine;
const IMAGE_MAX_HEIGHT = 300;

const note = {
  fontFamily: s.hand.fontFamily,
  fontWeight: 500,
  fontSize: SIZE.note,
  lineHeight: LINE / SIZE.note,
  color: INK.pen,
} as const;

const HEADING_SIZES: Record<number, number> = { 1: 19, 2: 15.5 };

const Inlines = ({ content }: { content: Inline[] }) => (
  <>
    {content.map((inline, i) => {
      if (inline.type === 'break') return <Text key={i}>{'\n'}</Text>;
      const decoration = [
        inline.underline || inline.href ? 'underline' : null,
        inline.strike ? 'line-through' : null,
      ]
        .filter(Boolean)
        .join(' ');
      const style = {
        ...(inline.bold ? { fontWeight: 700 } : {}),
        // Pas d'italique : la main a déjà sa pente ; on appuie un peu.
        ...(inline.em && !inline.bold ? { fontWeight: 600 } : {}),
        ...(inline.code
          ? { fontFamily: TYPE, fontWeight: 400, fontSize: SIZE.note * 0.7 }
          : {}),
        ...(decoration ? { textDecoration: decoration as 'underline' } : {}),
      };
      const text = pdfText(inline.text);
      return inline.href ? (
        <Link key={i} src={inline.href} style={{ color: INK.pen, ...style }}>
          {text}
        </Link>
      ) : (
        <Text key={i} style={style}>
          {text}
        </Text>
      );
    })}
  </>
);

const NoteImage = ({
  block,
  model,
}: {
  block: Extract<NoteBlock, { type: 'image' }>;
  model: SheetModel;
}) => {
  const image = model.assets.images.get(block.url);
  if (!image) {
    return (
      <Text style={[s.caption, { marginBottom: LINE / 2 }]}>
        {`Image indisponible${block.alt ? `\u00a0: ${pdfText(block.alt)}` : '.'}`}
      </Text>
    );
  }
  const scale = Math.min(
    1,
    CONTENT_WIDTH / image.width,
    IMAGE_MAX_HEIGHT / image.height,
  );
  return (
    <View wrap={false} style={{ marginBottom: LINE / 2 }}>
      <PdfImage
        src={{ data: image.data, format: image.format }}
        style={{ width: image.width * scale, height: image.height * scale }}
      />
    </View>
  );
};

const Block = ({
  block,
  model,
  first,
  tight = false,
}: {
  block: NoteBlock;
  model: SheetModel;
  first: boolean;
  /** Dans une liste : pas de ligne blanche après le paragraphe. */
  tight?: boolean;
}) => {
  const after = tight ? 0 : LINE / 2;
  switch (block.type) {
    case 'heading': {
      const size = HEADING_SIZES[block.depth] ?? SIZE.note;
      return (
        <Text
          minPresenceAhead={LINE * 2}
          style={[
            note,
            {
              fontWeight: 700,
              fontSize: size,
              lineHeight: LINE / size,
              maxWidth: MEASURE,
              marginTop: first ? 0 : LINE / 2,
              marginBottom: LINE / 3,
              ...(block.depth > 2
                ? { textDecoration: 'underline' as const }
                : {}),
            },
          ]}
        >
          <Inlines content={block.content} />
        </Text>
      );
    }
    case 'paragraph':
      return (
        <Text style={[note, { maxWidth: MEASURE, marginBottom: after }]}>
          <Inlines content={block.content} />
        </Text>
      );
    case 'list':
      return (
        <View style={{ marginBottom: after, maxWidth: MEASURE }}>
          {block.items.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row' }}>
              <View style={{ width: 14, paddingTop: 5.5 }}>
                {item.checked !== null ? (
                  <Checkbox checked={item.checked} size={7} />
                ) : (
                  <Text style={[note, { marginTop: -5.5 }]}>
                    {block.ordered ? `${block.start + i}.` : '•'}
                  </Text>
                )}
              </View>
              <View style={{ flexGrow: 1, flexBasis: 0 }}>
                {item.blocks.map((child, j) => (
                  <Block
                    key={j}
                    block={child}
                    model={model}
                    first={j === 0}
                    tight
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      );
    case 'quote':
      return (
        <View
          style={{
            borderLeftWidth: 0.75,
            borderLeftColor: INK.pen,
            paddingLeft: 8,
            marginBottom: LINE / 2,
          }}
        >
          {block.blocks.map((child, j) => (
            <Block key={j} block={child} model={model} first={j === 0} />
          ))}
        </View>
      );
    case 'rule':
      return (
        <View style={{ alignItems: 'center', marginBottom: LINE / 2 }}>
          <Fleuron />
        </View>
      );
    case 'code':
      return (
        <Text
          style={[
            s.body,
            { fontSize: 8, marginBottom: LINE / 2, maxWidth: MEASURE },
          ]}
        >
          {pdfText(block.value)}
        </Text>
      );
    case 'table':
      return (
        <View style={{ marginBottom: LINE / 2 }}>
          {block.rows.map((row, r) => (
            <View
              key={r}
              wrap={false}
              style={[
                { flexDirection: 'row', paddingVertical: 2 },
                r === 0 ? s.groupRule : s.hairline,
              ]}
            >
              {row.map((cell, c) => (
                <Text
                  key={c}
                  style={[
                    note,
                    {
                      flexGrow: 1,
                      flexBasis: 0,
                      paddingHorizontal: 3,
                      fontSize: 11,
                      lineHeight: 1.2,
                      textAlign: block.align[c] ?? 'left',
                      ...(r === 0 ? { fontWeight: 700 } : {}),
                    },
                  ]}
                >
                  <Inlines content={cell} />
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
    case 'image':
      return <NoteImage block={block} model={model} />;
  }
};

/** Les notes de la fiche, sur une nouvelle page si elles ne sont pas vides. */
export const Notes = ({ model }: { model: SheetModel }) => (
  <Section title="Notes" breakBefore={model.notes.length > 0}>
    {model.notes.length === 0 ? (
      <Text style={s.empty}>Aucune note.</Text>
    ) : (
      model.notes.map((block, i) => (
        <Block key={i} block={block} model={model} first={i === 0} />
      ))
    )}
  </Section>
);
