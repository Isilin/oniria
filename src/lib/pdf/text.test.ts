import { describe, expect, it } from 'vitest';
import { hyphenate, pdfText } from './text';

describe('texte du PDF', () => {
  it('remplace l’espace fine insécable, absente des polices', () => {
    expect(pdfText('1\u202f200')).toBe('1\u00a0200');
  });

  it('retire les émojis', () => {
    expect(pdfText('🌙 Lyse')).toBe(' Lyse');
    expect(pdfText('Lyse 🌙 la Lune')).toBe('Lyse la Lune');
    expect(pdfText('👩‍🚀 Corwin')).toBe(' Corwin');
    expect(pdfText('drapeau 🇫🇷')).toBe('drapeau ');
  });

  it('garde les lettres et la ponctuation françaises', () => {
    const text = 'Œuvre · L’Équilibre « 31 » −5 : ça va !';
    expect(pdfText(text)).toBe(text);
  });

  it('accepte les valeurs absentes et les nombres', () => {
    expect(pdfText(null)).toBe('');
    expect(pdfText(undefined)).toBe('');
    expect(pdfText(42)).toBe('42');
  });

  it('ne coupe jamais un mot ordinaire', () => {
    expect(hyphenate('Anticonstitutionnellement')).toEqual([
      'Anticonstitutionnellement',
    ]);
    expect(hyphenate('L’Équilibre')).toEqual(['L’Équilibre']);
  });

  it('découpe un mot sans fin pour qu’il passe à la ligne', () => {
    const url = 'https://exemple.org/un/tres/long/chemin';
    const parts = hyphenate(url);
    expect(parts.join('')).toBe(url);
    expect(parts.every((p) => [...p].length <= 12)).toBe(true);
  });
});
