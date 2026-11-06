import type { Parent, PhrasingContent, RootContent, TableRow } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough';
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table';
import { gfmTaskListItemFromMarkdown } from 'mdast-util-gfm-task-list-item';
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough';
import { gfmTable } from 'micromark-extension-gfm-table';
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item';

/**
 * Les notes de la fiche (Markdown écrit par l'éditeur) réduites à des blocs
 * simples que la mise en page du PDF sait dessiner : titres, paragraphes,
 * listes, citations, tableaux, images. Ce que l'éditeur enregistre en HTML
 * (souligné `<u>`, image redimensionnée `<img>`, `<br>`) est compris ; le
 * reste du HTML est retiré, son texte gardé. Ne lève jamais : une note mal
 * formée s'imprime en texte.
 */

export interface InlineText {
  type: 'text';
  text: string;
  bold?: boolean;
  em?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  /** Lien http(s) ou mailto seulement. */
  href?: string;
}

export type Inline = InlineText | { type: 'break' };

export type NoteBlock =
  | { type: 'heading'; depth: number; content: Inline[] }
  | { type: 'paragraph'; content: Inline[] }
  | {
      type: 'list';
      ordered: boolean;
      start: number;
      items: { checked: boolean | null; blocks: NoteBlock[] }[];
    }
  | { type: 'quote'; blocks: NoteBlock[] }
  | { type: 'rule' }
  | { type: 'code'; value: string }
  | {
      type: 'table';
      align: ('left' | 'right' | 'center' | null)[];
      /** La première ligne est l'en-tête. */
      rows: Inline[][][];
    }
  | { type: 'image'; url: string; alt: string };

type Marks = Omit<InlineText, 'type' | 'text'>;

const SAFE_LINK = /^(https?:|mailto:)/i;
const IMAGE_URL = /^https?:/i;

const attribute = (html: string, name: string) => {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i',
  ).exec(html);
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null;
};

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');

const stripTags = (html: string) =>
  decodeEntities(html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ''));

/** Les `<img>` d'un morceau de HTML, dans l'ordre. */
const htmlImages = (html: string) =>
  [...html.matchAll(/<img\b[^>]*>/gi)]
    .map((m) => ({
      url: attribute(m[0], 'src') ?? '',
      alt: decodeEntities(attribute(m[0], 'alt') ?? ''),
    }))
    .filter((img) => img.url);

/** Un paragraphe en cours de lecture : texte, et images qui le coupent. */
type Piece = Inline | { type: 'image'; url: string; alt: string };

const phrasing = (
  nodes: PhrasingContent[],
  marks: Marks,
  out: Piece[],
  state: { underline: boolean },
) => {
  for (const node of nodes) {
    const current = { ...marks, ...(state.underline && { underline: true }) };
    switch (node.type) {
      case 'text':
        out.push({ type: 'text', text: node.value, ...current });
        break;
      case 'inlineCode':
        out.push({ type: 'text', text: node.value, ...current, code: true });
        break;
      case 'break':
        out.push({ type: 'break' });
        break;
      case 'strong':
        phrasing(node.children, { ...marks, bold: true }, out, state);
        break;
      case 'emphasis':
        phrasing(node.children, { ...marks, em: true }, out, state);
        break;
      case 'delete':
        phrasing(node.children, { ...marks, strike: true }, out, state);
        break;
      case 'link':
        phrasing(
          node.children,
          SAFE_LINK.test(node.url) ? { ...marks, href: node.url } : marks,
          out,
          state,
        );
        break;
      case 'linkReference':
        phrasing(node.children, marks, out, state);
        break;
      case 'image':
        out.push({ type: 'image', url: node.url, alt: node.alt ?? '' });
        break;
      case 'imageReference':
        if (node.alt) out.push({ type: 'text', text: node.alt, ...current });
        break;
      case 'html': {
        const tag = node.value.trim().toLowerCase();
        if (/^<u\b[^>]*>$/.test(tag)) state.underline = true;
        else if (tag === '</u>') state.underline = false;
        else if (/^<br\s*\/?>$/.test(tag)) out.push({ type: 'break' });
        else {
          const images = htmlImages(node.value);
          if (images.length) {
            for (const img of images) out.push({ type: 'image', ...img });
          } else {
            const text = stripTags(node.value);
            if (text) out.push({ type: 'text', text, ...current });
          }
        }
        break;
      }
      default:
        // Nœud inconnu (extension future) : son texte, s'il en a.
        if ('children' in node) {
          phrasing(node.children as PhrasingContent[], marks, out, state);
        } else if ('value' in node && typeof node.value === 'string') {
          out.push({ type: 'text', text: node.value, ...current });
        }
    }
  }
  return out;
};

const isImage = (piece: Piece): piece is Extract<Piece, { type: 'image' }> =>
  piece.type === 'image';

const hasText = (content: Inline[]) =>
  content.some((i) => i.type === 'text' && i.text.trim() !== '');

/** Un paragraphe, coupé autour de ses images (une image est un bloc). */
const paragraphBlocks = (
  nodes: PhrasingContent[],
  wrap: (content: Inline[]) => NoteBlock,
) => {
  const blocks: NoteBlock[] = [];
  let content: Inline[] = [];
  const flush = () => {
    if (hasText(content)) blocks.push(wrap(content));
    content = [];
  };
  for (const piece of phrasing(nodes, {}, [], { underline: false })) {
    if (isImage(piece)) {
      flush();
      blocks.push(piece);
    } else {
      content.push(piece);
    }
  }
  flush();
  return blocks;
};

const cell = (nodes: PhrasingContent[]): Inline[] =>
  phrasing(nodes, {}, [], { underline: false }).map((piece) =>
    isImage(piece) ? { type: 'text', text: piece.alt } : piece,
  );

const flow = (nodes: RootContent[]): NoteBlock[] =>
  nodes.flatMap((node): NoteBlock[] => {
    switch (node.type) {
      case 'heading':
        return paragraphBlocks(node.children, (content) => ({
          type: 'heading',
          depth: node.depth,
          content,
        }));
      case 'paragraph':
        return paragraphBlocks(node.children, (content) => ({
          type: 'paragraph',
          content,
        }));
      case 'list':
        return [
          {
            type: 'list',
            ordered: !!node.ordered,
            start: node.start ?? 1,
            items: node.children.map((item) => ({
              checked: item.checked ?? null,
              blocks: flow(item.children),
            })),
          },
        ];
      case 'blockquote':
        return [{ type: 'quote', blocks: flow(node.children) }];
      case 'thematicBreak':
        return [{ type: 'rule' }];
      case 'code':
        return node.value ? [{ type: 'code', value: node.value }] : [];
      case 'table':
        return [
          {
            type: 'table',
            align: node.align ?? [],
            rows: node.children.map((row: TableRow) =>
              row.children.map((c) => cell(c.children)),
            ),
          },
        ];
      case 'html': {
        const images = htmlImages(node.value);
        if (images.length) {
          return images.map((img) => ({ type: 'image' as const, ...img }));
        }
        const text = stripTags(node.value).trim();
        return text
          ? [{ type: 'paragraph', content: [{ type: 'text', text }] }]
          : [];
      }
      case 'definition':
        return [];
      default:
        if ('children' in node) return flow((node as Parent).children);
        return [];
    }
  });

/** Les blocs des notes. Une note vide n'en a aucun. */
export const parseNotes = (
  markdown: string | null | undefined,
): NoteBlock[] => {
  if (!markdown?.trim()) return [];
  try {
    const tree = fromMarkdown(markdown, {
      extensions: [gfmTable(), gfmStrikethrough(), gfmTaskListItem()],
      mdastExtensions: [
        gfmTableFromMarkdown(),
        gfmStrikethroughFromMarkdown(),
        gfmTaskListItemFromMarkdown(),
      ],
    });
    return flow(tree.children);
  } catch {
    // Dernier recours : le texte brut, paragraphe par paragraphe.
    return markdown
      .split(/\n{2,}/)
      .filter((p) => p.trim())
      .map((p) => ({
        type: 'paragraph',
        content: [{ type: 'text', text: p }],
      }));
  }
};

/** Les adresses des images des notes (http ou https seulement). */
export const noteImageUrls = (blocks: NoteBlock[]): string[] =>
  blocks.flatMap((block) => {
    switch (block.type) {
      case 'image':
        return IMAGE_URL.test(block.url) ? [block.url] : [];
      case 'list':
        return block.items.flatMap((item) => noteImageUrls(item.blocks));
      case 'quote':
        return noteImageUrls(block.blocks);
      default:
        return [];
    }
  });
