import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import { getSession } from '@/lib/server/session';
import type { Metadata } from 'next';
import { Alegreya_Sans, Alegreya_Sans_SC, Spectral } from 'next/font/google';
import './globals.css';
import styles from './page.module.css';
import Providers from './providers';

// Polices servies par l'application (next/font) : noms et chiffres en
// Spectral, interface en Alegreya Sans, en-têtes en petites capitales.
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-spectral',
});
const alegreya = Alegreya_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-alegreya',
});
const alegreyaSC = Alegreya_Sans_SC({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-alegreya-sc',
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
      className={`${spectral.variable} ${alegreya.variable} ${alegreyaSC.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers session={session}>
          <div className={styles.page}>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
