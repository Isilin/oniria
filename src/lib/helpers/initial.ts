/**
 * Première lettre d'un nom, telle qu'on la lit : un emoji, une lettre
 * accentuée composée ou un drapeau ne sont pas coupés en deux.
 */
export const initialOf = (name?: string | null) => {
  const text = (name ?? '').trim();
  if (!text) return '?';
  const first =
    typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? ([
          ...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(
            text,
          ),
        ][0]?.segment ?? text)
      : Array.from(text)[0];
  // « ß » donnerait « SS » : une initiale reste une seule lettre.
  const upper = first.toLocaleUpperCase('fr');
  return Array.from(upper).length === Array.from(first).length ? upper : first;
};
