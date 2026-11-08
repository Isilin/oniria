/**
 * Texte de la fiche préparé pour le PDF. Les polices du carnet (sous-
 * ensemble latin) n'ont ni émojis ni espace fine insécable : un glyphe
 * absent laisserait un trou ou un carré dans la feuille imprimée.
 */

const PICTOGRAPHS =
  /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u200d\ufe0e\ufe0f\u20e3]/gu;

/** Remplace ce que les polices n'ont pas, et retire les émojis. */
export const pdfText = (value: unknown) => {
  if (value === null || value === undefined) return '';
  return (
    String(value)
      // Espace fine insécable (milliers en fr-FR, « : ») : l'insécable simple.
      .replace(/\u202f/g, '\u00a0')
      .replace(PICTOGRAPHS, '')
      // Un émoji retiré entre deux mots laisse deux espaces.
      .replace(/ {2,}/g, ' ')
  );
};

/** Un mot plus long que ça (une adresse collée) peut être coupé. */
const LONG_WORD = 30;
const CHUNK = 12;

/**
 * Césure : jamais dans un mot français ordinaire (react-pdf couperait
 * « Équi-libre » au hasard des syllabes anglaises). Seul un mot sans fin
 * est découpé, pour qu'il passe à la ligne au lieu de déborder.
 */
export const hyphenate = (word: string) => {
  const chars = [...word];
  if (chars.length <= LONG_WORD) return [word];
  const parts: string[] = [];
  for (let i = 0; i < chars.length; i += CHUNK) {
    parts.push(chars.slice(i, i + CHUNK).join(''));
  }
  return parts;
};
