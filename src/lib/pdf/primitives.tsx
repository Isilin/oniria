'use no memo';

import { Text, View } from '@react-pdf/renderer';
import type { ComponentProps, ReactNode } from 'react';
import { Armillary, Checkbox } from './ornaments';
import { INK, s, SIZE } from './styles';
import { pdfText } from './text';

/**
 * Les pièces imprimées de la fiche : titres frappés, lignes de valeurs,
 * champs, puces, tableaux. Voir DESIGN.md (Components).
 */

export type Style = NonNullable<ComponentProps<typeof View>['style']>;

/** Une valeur absente s'imprime « - » à l'encre pâle. */
export const isBlank = (value: unknown) =>
  value === null || value === undefined || String(value).trim() === '';

/**
 * Titre de section : sphère armillaire, titre frappé au tampon, filet
 * courant. Jamais seul en bas de page.
 */
export const SectionHeading = ({
  title,
  children,
}: {
  title: string;
  /** Après le titre, avant le filet (puce d'état…). */
  children?: ReactNode;
}) => (
  <View
    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}
    minPresenceAhead={70}
    wrap={false}
  >
    <Armillary />
    <Text style={[s.section, { marginLeft: 5, marginRight: 6 }]}>{title}</Text>
    {children}
    <View
      style={{
        flexGrow: 1,
        marginLeft: children ? 6 : 0,
        borderBottomWidth: 0.6,
        borderBottomColor: INK.hairline,
      }}
    />
  </View>
);

/** Une section de la fiche : son titre, puis son contenu. */
export const Section = ({
  title,
  heading,
  children,
  style,
  breakBefore,
}: {
  title: string;
  heading?: ReactNode;
  children: ReactNode;
  style?: Style;
  breakBefore?: boolean;
}) => (
  <View style={[{ marginBottom: 16 }, style ?? {}]} break={breakBefore}>
    <SectionHeading title={title}>{heading}</SectionHeading>
    {children}
  </View>
);

/** Titre de groupe tapé (LE CORPS, LA SPYRÉE…), sur un filet de groupe. */
export const GroupTitle = ({
  title,
  right,
  rule = true,
  style,
}: {
  title: string;
  right?: ReactNode;
  rule?: boolean;
  style?: Style;
}) => (
  <View
    style={[
      {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 2,
        marginBottom: 3,
      },
      rule ? s.groupRule : {},
      style ?? {},
    ]}
    minPresenceAhead={40}
    wrap={false}
  >
    <Text style={s.group}>{title}</Text>
    {right}
  </View>
);

/** Une ligne imprimée : libellé tapé à gauche, valeur à droite. */
export const StatRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <View
    style={[
      {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 1.6,
      },
      s.hairline,
    ]}
    wrap={false}
  >
    <Text style={s.rowLabel}>{label}</Text>
    {children}
  </View>
);

/** Valeur écrite à la main, ou « - » à l'encre pâle quand elle manque. */
export const Hand = ({ value, style }: { value: unknown; style?: Style }) =>
  isBlank(value) ? (
    <Text style={[s.hand, style ?? {}, { color: INK.pale }]}>-</Text>
  ) : (
    <Text style={[s.hand, style ?? {}]}>{pdfText(value)}</Text>
  );

/** Valeur tapée (calculée par les règles), ou « - ». */
export const Typed = ({ value, style }: { value: unknown; style?: Style }) => (
  <Text
    style={[s.body, isBlank(value) ? { color: INK.pale } : {}, style ?? {}]}
  >
    {isBlank(value) ? '-' : pdfText(value)}
  </Text>
);

/** Champ de la plaque : libellé tapé, valeur écrite sur une ligne imprimée. */
export const Field = ({
  label,
  children,
  style,
}: {
  label: string;
  children: ReactNode;
  style?: Style;
}) => (
  <View style={style}>
    <Text style={s.label}>{label}</Text>
    <View style={[s.fieldLine, { paddingBottom: 1, minHeight: 16 }]}>
      {children}
    </View>
  </View>
);

/** Puce imprimée, au contour de l'encre donnée. */
export const Chip = ({
  label,
  color = INK.print,
  icon,
}: {
  label: string;
  color?: string;
  icon?: ReactNode;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0.7,
      borderColor: color,
      borderRadius: 1.5,
      paddingHorizontal: 3,
      paddingTop: 1.3,
      paddingBottom: 0.5,
      flexShrink: 0,
    }}
  >
    {icon && <View style={{ marginRight: 2 }}>{icon}</View>}
    <Text
      style={{
        fontFamily: s.body.fontFamily,
        fontWeight: 700,
        fontSize: 6.5,
        color,
      }}
    >
      {pdfText(label)}
    </Text>
  </View>
);

/** Note d'information : papier relevé, filet d'état à gauche. */
export const InfoNote = ({
  title,
  color = INK.info,
  children,
}: {
  title?: string;
  color?: string;
  children: ReactNode;
}) => (
  <View
    style={{
      backgroundColor: INK.raised,
      borderLeftWidth: 1.5,
      borderLeftColor: color,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 8,
    }}
    wrap={false}
  >
    {title && (
      <Text style={[s.body, { fontWeight: 700, color, marginBottom: 2 }]}>
        {title}
      </Text>
    )}
    {children}
  </View>
);

export interface Column<T> {
  label: string;
  /** Largeur fixe (pt), sinon part de la largeur restante. */
  width?: number;
  weight?: number;
  align?: 'left' | 'right' | 'center';
  /** Valeur écrite par le joueur (main) ou tapée (règles, catalogue). */
  hand?: boolean;
  value?: (row: T) => unknown;
  render?: (row: T) => ReactNode;
}

const cellStyle = <T,>(column: Column<T>): Style => ({
  ...(column.width
    ? { width: column.width }
    : { flexGrow: column.weight ?? 1, flexBasis: 0 }),
  paddingHorizontal: 2.5,
  alignItems:
    column.align === 'right'
      ? 'flex-end'
      : column.align === 'center'
        ? 'center'
        : 'flex-start',
});

/**
 * Décalage d'une valeur tapée dans un tableau : la machine à écrire est
 * plus petite que la main ; sans lui, elle flotterait au-dessus de la ligne.
 */
export const TYPED_CELL_OFFSET = 3;

/**
 * Tableau imprimé : en-têtes tapés sur un filet de groupe, une ligne par
 * élément, jamais coupée entre deux pages.
 */
export function PdfTable<T extends { id?: string }>({
  columns,
  rows,
  empty,
  size = SIZE.handCell,
}: {
  columns: Column<T>[];
  rows: T[];
  empty: string;
  /** Taille de l'écriture dans les cellules. */
  size?: number;
}) {
  if (rows.length === 0) {
    return <Text style={[s.empty, { marginBottom: 2 }]}>{empty}</Text>;
  }
  return (
    <View>
      <View
        style={[{ flexDirection: 'row', paddingBottom: 2 }, s.groupRule]}
        minPresenceAhead={30}
        wrap={false}
      >
        {columns.map((column, i) => (
          <View key={i} style={cellStyle(column)}>
            <Text style={[s.label, { fontSize: 6, letterSpacing: 0.2 }]}>
              {column.label}
            </Text>
          </View>
        ))}
      </View>
      {rows.map((row, r) => (
        <View
          key={row.id ?? r}
          style={[{ flexDirection: 'row', paddingVertical: 2.2 }, s.hairline]}
          wrap={false}
        >
          {columns.map((column, i) => (
            <View key={i} style={cellStyle(column)}>
              {column.render ? (
                column.render(row)
              ) : column.hand ? (
                <Hand value={column.value?.(row)} style={{ fontSize: size }} />
              ) : (
                <Typed
                  value={column.value?.(row)}
                  style={{ fontSize: 7.5, paddingTop: TYPED_CELL_OFFSET }}
                />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** Case « Porté » d'un équipement. */
export const Worn = ({ worn }: { worn: boolean }) => (
  <View style={{ paddingTop: 2 }}>
    <Checkbox checked={worn} />
  </View>
);
