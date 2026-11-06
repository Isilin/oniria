/**
 * Noms des fichiers téléchargés (export PDF) : sûrs pour tous les systèmes,
 * et transmis au navigateur dans `Content-Disposition` avec leurs accents.
 */

const FORBIDDEN = /[\u0000-\u001f\u007f/\\:*?"<>|]/g;
const MAX_LENGTH = 150;

/**
 * Nom de fichier tiré d'un nom de personnage ou de table : sans caractères
 * interdits (Windows, macOS), sans espaces superflus, ni trop long. Vide,
 * il devient `fallback`.
 */
export const sanitizeFilename = (
  name: string | null | undefined,
  fallback: string,
) => {
  const clean = (name ?? '')
    .normalize('NFC')
    .replace(FORBIDDEN, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    // Ni point ni espace en fin de nom (Windows les retire).
    .replace(/[. ]+$/, '');
  const chars = [...clean];
  const short =
    chars.length > MAX_LENGTH
      ? chars.slice(0, MAX_LENGTH).join('').trim()
      : clean;
  return short || fallback;
};

/** Repli ASCII du nom, pour les navigateurs qui ignorent `filename*`. */
const asciiFallback = (filename: string) =>
  filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Un « _ » par caractère : un émoji n'en vaut qu'un.
    .replace(/[^\x20-\x7e]/gu, '_')
    .replace(/["\\]/g, '_');

/** Encodage RFC 5987 : tout ce qui n'est pas sûr dans un en-tête. */
const encodeRfc5987 = (value: string) =>
  encodeURIComponent(value).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );

/** En-tête `Content-Disposition` d'un fichier à télécharger. */
export const contentDisposition = (filename: string) =>
  `attachment; filename="${asciiFallback(filename)}"; filename*=UTF-8''${encodeRfc5987(filename)}`;

/** Le nom de fichier annoncé par le serveur, ou `null`. */
export const filenameFromDisposition = (header: string | null) => {
  if (!header) return null;
  const extended = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(header);
  if (extended) {
    try {
      return decodeURIComponent(extended[1].trim());
    } catch {
      // Encodage invalide : on se rabat sur le nom simple.
    }
  }
  const plain = /filename\s*=\s*"([^"]*)"/i.exec(header);
  return plain ? plain[1] : null;
};
