import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import '@mdxeditor/editor/style.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import styles from './page.module.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Lunes d'Oniria",
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          <div className={styles.page}>
            <main className={styles.main}>
              <Header />
              {children}
              <Footer />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
