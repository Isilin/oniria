'use no memo';

import { Image as PdfImage, Text, View } from '@react-pdf/renderer';
import { initialOf } from '@/lib/helpers/initial';
import { devenirIntensity, tintOf } from '@/lib/tints';
import { HAND } from '../fonts';
import { type SheetModel, sheetName } from '../model';
import { PortraitMoon, TintWash } from '../ornaments';
import { Field, Hand } from '../primitives';
import { CONTENT_WIDTH, INK, s } from '../styles';
import { pdfText } from '../text';

const PORTRAIT = { width: 72, height: 81 };
const PLATE_HEIGHT = 114;

/** Le portrait : l'image, ou la lune teintée avec l'initiale du nom. */
const Portrait = ({ model }: { model: SheetModel }) => {
  const { sheet, assets } = model;
  const tint = tintOf(sheet.tint);
  const { transcendent } = devenirIntensity(sheet.become);
  const frame = (
    <View
      style={{
        width: PORTRAIT.width,
        height: PORTRAIT.height,
        borderWidth: 1.1,
        borderColor: INK.print,
        overflow: 'hidden',
        backgroundColor: INK.paper,
      }}
    >
      {assets.avatar ? (
        <PdfImage
          src={{ data: assets.avatar.data, format: assets.avatar.format }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
          }}
        />
      ) : (
        <>
          <PortraitMoon
            color={tint.day}
            width={PORTRAIT.width - 2.2}
            height={PORTRAIT.height - 2.2}
          />
          <Text
            style={{
              position: 'absolute',
              top: 22,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: HAND,
              fontWeight: 700,
              fontSize: 26,
              color: INK.pen,
            }}
          >
            {pdfText(initialOf(sheet.name)) || '?'}
          </Text>
        </>
      )}
    </View>
  );
  return (
    <View style={{ alignItems: 'center' }}>
      {/* Transcendance : un second cadre, dans la teinte, autour du premier. */}
      {transcendent ? (
        <View style={{ borderWidth: 1.1, borderColor: tint.day, padding: 2.4 }}>
          {frame}
        </View>
      ) : (
        frame
      )}
      <Text style={[s.label, { fontSize: 6, marginTop: 3 }]}>Portrait</Text>
    </View>
  );
};

/**
 * La plaque du personnage : portrait, nom, joueur·euse et table, Âge,
 * Aspect, Devenir, sur le lavis de sa teinte de lune.
 */
export const Plate = ({ model }: { model: SheetModel }) => {
  const { sheet } = model;
  const tint = tintOf(sheet.tint);
  const { level, transcendent } = devenirIntensity(sheet.become);
  const teams = sheet.teams.map((t) => t.name).filter(Boolean);
  return (
    <View
      wrap={false}
      style={{
        borderWidth: 1.1,
        borderColor: INK.print,
        height: PLATE_HEIGHT,
        marginBottom: 8,
        overflow: 'hidden',
      }}
    >
      <View style={{ position: 'absolute', top: 0, left: 0 }}>
        <TintWash
          color={tint.day}
          opacity={0.14 + 0.2 * level}
          width={CONTENT_WIDTH}
          height={PLATE_HEIGHT}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 9,
          paddingHorizontal: 12,
        }}
      >
        <Portrait model={model} />
        <View style={{ flexGrow: 1, flexBasis: 0, marginLeft: 14 }}>
          <Text style={s.label}>Nom</Text>
          <View style={[s.fieldLine, { paddingBottom: 1 }]}>
            <Text style={[s.hand, { fontSize: 26, lineHeight: 1.05 }]}>
              {pdfText(sheetName(sheet))}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={{ marginRight: 18 }}>
              <Text style={s.label}>Joueur·euse</Text>
              <Text style={s.body}>{pdfText(sheet.user?.name) || '-'}</Text>
            </View>
            {teams.length > 0 && (
              <View style={{ flexShrink: 1 }}>
                <Text style={s.label}>Table</Text>
                <Text style={s.body}>{pdfText(teams.join(', '))}</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <Field label="Âge" style={{ width: 62, marginRight: 14 }}>
              <Hand value={sheet.age ? `${sheet.age} ans` : null} />
            </Field>
            <Field
              label="Aspect"
              style={{ flexGrow: 1, flexBasis: 0, marginRight: 14 }}
            >
              <Hand value={sheet.aspect} />
            </Field>
            <Field
              label={transcendent ? 'Devenir · transcendé' : 'Devenir'}
              style={{ width: 96 }}
            >
              <Hand value={sheet.become} />
            </Field>
          </View>
        </View>
      </View>
    </View>
  );
};
