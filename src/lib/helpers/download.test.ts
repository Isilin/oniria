import { describe, expect, it } from 'vitest';
import {
  contentDisposition,
  filenameFromDisposition,
  sanitizeFilename,
} from './download';

describe('noms de fichiers', () => {
  it('garde les accents et retire les caractères interdits', () => {
    expect(sanitizeFilename('Lyse (test)', 'Fiche')).toBe('Lyse (test)');
    expect(sanitizeFilename('Éloïse / Corwin: "le" *grand*?', 'Fiche')).toBe(
      'Éloïse Corwin le grand',
    );
    expect(sanitizeFilename('  Table   de\ttest. ', 'Table')).toBe(
      'Table de test',
    );
  });

  it('se rabat sur un nom par défaut', () => {
    expect(sanitizeFilename('', 'Fiche')).toBe('Fiche');
    expect(sanitizeFilename(null, 'Fiche')).toBe('Fiche');
    expect(sanitizeFilename('///', 'Table')).toBe('Table');
  });

  it('raccourcit un nom trop long sans couper un émoji', () => {
    const name = sanitizeFilename(`${'a'.repeat(149)}🌙🌙`, 'Fiche');
    expect([...name]).toHaveLength(150);
    expect(name.endsWith('🌙')).toBe(true);
  });

  it('annonce le nom au navigateur, accents compris', () => {
    expect(contentDisposition('Lyse (test).pdf')).toBe(
      `attachment; filename="Lyse (test).pdf"; filename*=UTF-8''Lyse%20%28test%29.pdf`,
    );
    expect(contentDisposition('Éclat "rare".pdf')).toBe(
      `attachment; filename="Eclat _rare_.pdf"; filename*=UTF-8''%C3%89clat%20%22rare%22.pdf`,
    );
    expect(contentDisposition('🌙 Lune.pdf')).toContain(
      'filename="_ Lune.pdf"',
    );
  });

  it('relit le nom annoncé par le serveur', () => {
    for (const name of ['Lyse (test).pdf', 'Éclat "rare".pdf', '🌙 Lune.pdf']) {
      expect(filenameFromDisposition(contentDisposition(name))).toBe(name);
    }
    expect(filenameFromDisposition('attachment; filename="a.pdf"')).toBe(
      'a.pdf',
    );
    expect(filenameFromDisposition(null)).toBeNull();
    expect(filenameFromDisposition('inline')).toBeNull();
  });
});
