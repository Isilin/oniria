import { StyleSheet } from '@react-pdf/renderer';
import { DAY, DAY_EXISTENCES, DAY_INKS } from '@/theme/palette';
import { HAND, STAMP, TYPE } from './fonts';

/**
 * Le carnet imprimé : papier Jour, encre d'imprimerie, encre bleue.
 * Échelle : 1 px à l'écran ≈ 0,6 pt sur la feuille A4. Les encres
 * transparentes de l'écran sont précalculées sur le papier (le PDF n'a pas
 * de variables CSS, et un aplat opaque s'imprime net).
 */
export const INK = {
  paper: DAY.paper,
  raised: DAY.raised,
  print: DAY.print,
  pale: DAY.print2,
  pen: DAY.pen,
  /** Filet fin : encre à 24 % sur le papier. */
  hairline: '#c4bba7',
  /** La marge rouge du carnet. */
  margin: '#dcb39d',
  ...DAY_INKS,
};

export const EXISTENCE = DAY_EXISTENCES;

export const PAGE = {
  width: 595.28,
  height: 841.89,
  /** Marges intérieures du contenu (le cadre et la marge rouge autour). */
  top: 62,
  right: 34,
  bottom: 48,
  left: 56,
};

export const CONTENT_WIDTH = PAGE.width - PAGE.left - PAGE.right;

export const SIZE = {
  label: 7,
  rowLabel: 7.5,
  body: 8.5,
  caption: 7,
  numeral: 9,
  total: 13,
  group: 8.5,
  section: 9.5,
  hand: 12.5,
  handCell: 11,
  handValue: 15,
  handExistence: 22,
  name: 28,
  note: 12.5,
  noteLine: 18,
};

export const s = StyleSheet.create({
  page: {
    backgroundColor: INK.paper,
    paddingTop: PAGE.top,
    paddingRight: PAGE.right,
    paddingBottom: PAGE.bottom,
    paddingLeft: PAGE.left,
    fontFamily: TYPE,
    fontSize: SIZE.body,
    color: INK.print,
    lineHeight: 1.4,
  },
  /** Libellé imprimé : NOM, ÂGE, LA SANTÉ… */
  label: {
    fontFamily: TYPE,
    fontSize: SIZE.label,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: INK.pale,
  },
  rowLabel: {
    fontFamily: TYPE,
    fontSize: SIZE.rowLabel,
    color: INK.pale,
  },
  body: { fontFamily: TYPE, fontSize: SIZE.body, color: INK.print },
  caption: { fontFamily: TYPE, fontSize: SIZE.caption, color: INK.pale },
  numeral: {
    fontFamily: TYPE,
    fontWeight: 700,
    fontSize: SIZE.numeral,
    color: INK.print,
  },
  total: {
    fontFamily: TYPE,
    fontWeight: 700,
    fontSize: SIZE.total,
    color: INK.print,
  },
  group: {
    fontFamily: TYPE,
    fontWeight: 700,
    fontSize: SIZE.group,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: INK.print,
  },
  section: {
    fontFamily: STAMP,
    fontSize: SIZE.section,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: INK.print,
  },
  /** Ce que le joueur écrit : à la main, à l'encre bleue. */
  hand: {
    fontFamily: HAND,
    fontWeight: 600,
    fontSize: SIZE.hand,
    color: INK.pen,
    lineHeight: 1.1,
  },
  handCell: {
    fontFamily: HAND,
    fontWeight: 600,
    fontSize: SIZE.handCell,
    color: INK.pen,
    lineHeight: 1.1,
  },
  handValue: {
    fontFamily: HAND,
    fontWeight: 700,
    fontSize: SIZE.handValue,
    color: INK.pen,
    lineHeight: 1,
  },
  row: { flexDirection: 'row' },
  /** Ligne de champ imprimée sous une valeur écrite. */
  fieldLine: { borderBottomWidth: 0.75, borderBottomColor: INK.print },
  hairline: { borderBottomWidth: 0.6, borderBottomColor: INK.hairline },
  groupRule: { borderBottomWidth: 1.1, borderBottomColor: INK.print },
  frame: { borderWidth: 1.1, borderColor: INK.print },
  empty: { fontFamily: TYPE, fontSize: SIZE.body, color: INK.pale },
});
