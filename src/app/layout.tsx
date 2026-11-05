import SvgDefs from '@/components/atoms/svg-defs';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import { getSession } from '@/lib/server/session';
import { FONT_VARIABLES } from '@/theme/fonts';
import type { Metadata } from 'next';
import './globals.css';
import styles from './page.module.css';
import Providers from './providers';

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
    <html lang="fr" className={FONT_VARIABLES} suppressHydrationWarning>
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
