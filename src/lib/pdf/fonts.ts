import { Font } from '@react-pdf/renderer';
import path from 'node:path';
import { hyphenate } from './text';

/**
 * Les trois écritures du carnet, embarquées dans le PDF : la main (Caveat),
 * la machine à écrire (Courier Prime, romain seulement) et le tampon
 * (Special Elite). Fichiers statiques par graisse, sous-ensemble latin, lus
 * sur le disque : Vercel les embarque avec la fonction (next.config.mjs,
 * `outputFileTracingIncludes`).
 */
export const HAND = 'Caveat';
export const TYPE = 'Courier Prime';
export const STAMP = 'Special Elite';

const file = (pkg: string, name: string) =>
  path.join(
    /* turbopackIgnore: true */ process.cwd(),
    'node_modules',
    '@fontsource',
    pkg,
    'files',
    name,
  );

let registered = false;

/** Enregistre les polices une seule fois par processus. */
export const registerFonts = () => {
  if (registered) return;
  registered = true;
  Font.register({
    family: HAND,
    fonts: [400, 500, 600, 700].map((weight) => ({
      src: file('caveat', `caveat-latin-${weight}-normal.woff`),
      fontWeight: weight,
    })),
  });
  Font.register({
    family: TYPE,
    fonts: [400, 700].map((weight) => ({
      src: file('courier-prime', `courier-prime-latin-${weight}-normal.woff`),
      fontWeight: weight,
    })),
  });
  Font.register({
    family: STAMP,
    src: file('special-elite', 'special-elite-latin-400-normal.woff'),
  });
  Font.registerHyphenationCallback(hyphenate);
};
