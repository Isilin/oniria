import SvgDefs from '@/components/atoms/svg-defs';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import { getSession } from '@/lib/server/session';
import type { Metadata } from 'next';
import { Caveat, Courier_Prime, Special_Elite } from 'next/font/google';
import './globals.css';
import styles from './page.module.css';
import Providers from './providers';

// Polices servies par l'application (next/font). Ce que le joueur écrit est
// manuscrit (Caveat) ; ce que les règles impriment est tapé à la machine
// (Courier Prime), les titres frappés au tampon (Special Elite).
const hand = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hand',
});
// Pas d'italique dans le texte tapé (DESIGN.md) : seulement le romain, pour
// ne pas précharger deux fichiers que personne ne lit.
const type = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-type',
});
const stamp = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-stamp',
});

export const metadata: Metadata = {
  title: "Lunes d'Oniria",
  description: 'Fiches de personnages du jeu de rôle Oniria.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html
      lang="fr"
      className={`${hand.variable} ${type.variable} ${stamp.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers session={session}>
          <SvgDefs />
          {/* La feuille posée sur la table : papier, cadre imprimé, lignes. */}
          <div className={styles.page}>
            <div className={styles.leaf}>
              <Header />
              <main className={styles.main}>{children}</main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
