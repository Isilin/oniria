'use no memo';

import { Page, Text, View } from '@react-pdf/renderer';
import type { ComponentProps, ReactNode } from 'react';
import { STAMP } from './fonts';
import { Fleuron, MoonPhases } from './ornaments';
import { INK, PAGE, s } from './styles';
import { pdfText } from './text';

/**
 * Une feuille du carnet, en A4 : papier Jour, double cadre imprimé, marge
 * rouge, bandeau-titre (fleurons, titre frappé, phases de lune, ONIRIA) et
 * pied de page (le nom du personnage, la page), répétés sur chaque page.
 */

const Frame = () => (
  <>
    <View
      fixed
      style={{
        position: 'absolute',
        top: 14,
        left: 14,
        right: 14,
        bottom: 14,
        borderWidth: 1.5,
        borderColor: INK.print,
      }}
    />
    <View
      fixed
      style={{
        position: 'absolute',
        top: 18.5,
        left: 18.5,
        right: 18.5,
        bottom: 18.5,
        borderWidth: 0.6,
        borderColor: INK.print,
      }}
    />
    {/* La marge rouge du carnet, sous le bandeau. */}
    <View
      fixed
      style={{
        position: 'absolute',
        top: 50,
        bottom: 18.5,
        left: PAGE.left - 10,
        borderLeftWidth: 0.9,
        borderLeftColor: INK.margin,
      }}
    />
  </>
);

const TitleBand = ({ title }: { title: string }) => (
  <View
    fixed
    style={{
      position: 'absolute',
      top: 18.5,
      left: 18.5,
      right: 18.5,
      height: 31.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0.6,
      borderBottomColor: INK.print,
    }}
  >
    <Fleuron />
    <Text
      style={[
        s.section,
        { fontSize: 8, marginHorizontal: 10, letterSpacing: 1.8 },
      ]}
    >
      {title}
    </Text>
    <MoonPhases />
    <Text
      style={{
        fontFamily: STAMP,
        fontSize: 9,
        letterSpacing: 3,
        marginHorizontal: 10,
        color: INK.print,
      }}
    >
      ONIRIA
    </Text>
    <Fleuron />
  </View>
);

/** Hauteur du pied de page, entre le contenu et le cadre. */
const FOOTER_TOP = PAGE.height - 38;

/**
 * Pied de page : deux textes posés directement sur la page. Un numéro de
 * page (`render`) placé dans une vue fixe dérègle la mise en page de
 * react-pdf au-delà d'une dizaine de pages.
 */
const Footer = ({ name, context }: { name: string; context?: string }) => (
  <>
    <Text
      fixed
      style={[
        s.hand,
        {
          position: 'absolute',
          top: FOOTER_TOP,
          left: PAGE.left,
          width: 400,
          fontSize: 10,
        },
      ]}
    >
      {pdfText(name)}
      {context ? (
        <Text style={s.caption}>{`  ·  ${pdfText(context)}`}</Text>
      ) : null}
    </Text>
    <Text
      fixed
      style={[
        s.caption,
        {
          position: 'absolute',
          top: FOOTER_TOP + 2,
          right: PAGE.right,
          width: 80,
          textAlign: 'right',
        },
      ]}
      render={({ subPageNumber, subPageTotalPages }) =>
        `p.\u00a0${subPageNumber}\u00a0/\u00a0${subPageTotalPages}`
      }
    />
  </>
);

export const SheetPage = ({
  title,
  footerName,
  footerContext,
  children,
  bookmark,
  id,
}: {
  title: string;
  footerName: string;
  footerContext?: string;
  children: ReactNode;
  bookmark?: ComponentProps<typeof Page>['bookmark'];
  id?: string;
}) => (
  <Page size="A4" style={s.page} bookmark={bookmark} id={id}>
    <Frame />
    <TitleBand title={title} />
    {children}
    <Footer name={footerName} context={footerContext} />
  </Page>
);
