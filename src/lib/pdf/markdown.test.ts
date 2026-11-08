import { describe, expect, it } from 'vitest';
import { noteImageUrls, parseNotes } from './markdown';

const text = (t: string, marks = {}) => ({ type: 'text', text: t, ...marks });

describe('notes en Markdown', () => {
  it('ne donne rien pour une note vide', () => {
    expect(parseNotes('')).toEqual([]);
    expect(parseNotes('   \n ')).toEqual([]);
    expect(parseNotes(null)).toEqual([]);
  });

  it('lit titres et paragraphes', () => {
    expect(parseNotes('# Lune\n\n## Voyage\n\nUn texte.')).toEqual([
      { type: 'heading', depth: 1, content: [text('Lune')] },
      { type: 'heading', depth: 2, content: [text('Voyage')] },
      { type: 'paragraph', content: [text('Un texte.')] },
    ]);
  });

  it('garde gras, italique, barré, code et souligné de l’éditeur', () => {
    const [block] = parseNotes(
      '**gras** *penché* ~~barré~~ `code` <u>souligné</u> fin',
    );
    expect(block).toEqual({
      type: 'paragraph',
      content: [
        text('gras', { bold: true }),
        text(' '),
        text('penché', { em: true }),
        text(' '),
        text('barré', { strike: true }),
        text(' '),
        text('code', { code: true }),
        text(' '),
        text('souligné', { underline: true }),
        text(' fin'),
      ],
    });
  });

  it('souligne aussi un passage en gras', () => {
    const [block] = parseNotes('<u>**fort**</u>');
    expect(block).toEqual({
      type: 'paragraph',
      content: [text('fort', { bold: true, underline: true })],
    });
  });

  it('passe à la ligne sur <br> et sur un retour dur', () => {
    const [block] = parseNotes('un<br>deux  \ntrois');
    expect(block.type === 'paragraph' && block.content).toEqual([
      text('un'),
      { type: 'break' },
      text('deux'),
      { type: 'break' },
      text('trois'),
    ]);
  });

  it('ne garde que les liens sûrs', () => {
    const [block] = parseNotes(
      '[site](https://oniria.fr) [mail](mailto:a@b.c) [x](javascript:alert(1))',
    );
    expect(block.type === 'paragraph' && block.content).toEqual([
      text('site', { href: 'https://oniria.fr' }),
      text(' '),
      text('mail', { href: 'mailto:a@b.c' }),
      text(' '),
      text('x'),
    ]);
  });

  it('lit les listes, numérotées ou à cocher', () => {
    expect(parseNotes('3. un\n4. deux')).toEqual([
      {
        type: 'list',
        ordered: true,
        start: 3,
        items: [
          {
            checked: null,
            blocks: [{ type: 'paragraph', content: [text('un')] }],
          },
          {
            checked: null,
            blocks: [{ type: 'paragraph', content: [text('deux')] }],
          },
        ],
      },
    ]);
    const [tasks] = parseNotes('- [x] fait\n- [ ] à faire');
    expect(tasks.type === 'list' && tasks.items.map((i) => i.checked)).toEqual([
      true,
      false,
    ]);
  });

  it('lit citations, filets et code', () => {
    expect(parseNotes('> dit-elle\n\n---\n\n```\nx = 1\n```')).toEqual([
      {
        type: 'quote',
        blocks: [{ type: 'paragraph', content: [text('dit-elle')] }],
      },
      { type: 'rule' },
      { type: 'code', value: 'x = 1' },
    ]);
  });

  it('lit les tableaux avec leur alignement', () => {
    const [table] = parseNotes('| Nom | PV |\n|:--|--:|\n| Lyse | 31 |');
    expect(table).toEqual({
      type: 'table',
      align: ['left', 'right'],
      rows: [
        [[text('Nom')], [text('PV')]],
        [[text('Lyse')], [text('31')]],
      ],
    });
  });

  it('fait des images des blocs, Markdown ou <img> de l’éditeur', () => {
    const blocks = parseNotes(
      'avant ![carte](https://x.org/carte.png) après\n\n<img src="https://x.org/a.jpg" alt="Lyse" width="200" />',
    );
    expect(blocks).toEqual([
      { type: 'paragraph', content: [text('avant ')] },
      { type: 'image', url: 'https://x.org/carte.png', alt: 'carte' },
      { type: 'paragraph', content: [text(' après')] },
      { type: 'image', url: 'https://x.org/a.jpg', alt: 'Lyse' },
    ]);
    expect(noteImageUrls(blocks)).toEqual([
      'https://x.org/carte.png',
      'https://x.org/a.jpg',
    ]);
  });

  it('ignore les images qui ne sont pas sur le web', () => {
    const blocks = parseNotes(
      '![a](data:image/png;base64,AAAA)\n\n- ![b](file:///etc/passwd)',
    );
    expect(noteImageUrls(blocks)).toEqual([]);
  });

  it('retire le HTML inconnu en gardant son texte', () => {
    expect(parseNotes('<div class="x">Bonjour &amp; bienvenue</div>')).toEqual([
      { type: 'paragraph', content: [text('Bonjour & bienvenue')] },
    ]);
  });

  it('ne lève jamais, même sur du texte étrange', () => {
    for (const odd of [
      '<',
      '<<u>>',
      '| a |',
      '[x](',
      '*'.repeat(500),
      '\u0000',
    ]) {
      expect(() => parseNotes(odd)).not.toThrow();
    }
  });
});
