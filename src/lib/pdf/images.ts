import { DAY } from '@/theme/palette';
import sharp from 'sharp';
import { safeGet } from './safe-fetch';

/**
 * Images de la fiche (portrait, images des notes) prêtes pour le PDF :
 * lues sans risque (safe-fetch), puis redressées, réduites et ré-encodées
 * en JPEG sur le papier. react-pdf ne lit que le JPEG et le PNG ; et une
 * photo pleine taille alourdirait le PDF au-delà de ce que Vercel renvoie
 * (4,5 Mo).
 */
export interface PdfImage {
  data: Buffer;
  format: 'jpg';
  width: number;
  height: number;
}

export type ImageLoader = (
  url: string,
  maxSize: number,
) => Promise<PdfImage | null>;

/**
 * Format d'image reconnu à ses premiers octets. Le SVG n'en fait pas
 * partie : un SVG peut aller lire d'autres fichiers en se dessinant.
 */
export const imageFormat = (body: Buffer) => {
  const ascii = (from: number, to: number) =>
    body.subarray(from, to).toString('latin1');
  if (body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff) return 'jpeg';
  if (ascii(0, 8) === '\x89PNG\r\n\x1a\n') return 'png';
  if (ascii(0, 4) === 'GIF8') return 'gif';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp';
  if (
    ascii(4, 8) === 'ftyp' &&
    /^(avif|avis|heic|heix|mif1)$/.test(ascii(8, 12))
  )
    return 'heif';
  return null;
};

/** Réduit l'image dans un carré de `maxSize` px, sur le papier, en JPEG. */
export const normalizeImage = async (
  body: Buffer,
  maxSize: number,
): Promise<PdfImage | null> => {
  if (!imageFormat(body)) return null;
  try {
    const { data, info } = await sharp(body, {
      // Première image d'un GIF animé ; pas d'image démesurée.
      animated: false,
      limitInputPixels: 40_000_000,
    })
      .rotate()
      .resize({
        width: maxSize,
        height: maxSize,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .flatten({ background: DAY.paper })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    return { data, format: 'jpg', width: info.width, height: info.height };
  } catch {
    return null;
  }
};

/** Lit et prépare une image distante, ou `null` si elle n'est pas lisible. */
export const loadImage: ImageLoader = async (url, maxSize) => {
  const response = await safeGet(url);
  if (!response) return null;
  return normalizeImage(response.body, maxSize);
};

/** Exécute des tâches avec au plus `limit` en même temps, dans l'ordre. */
export const pool = async <T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
};
