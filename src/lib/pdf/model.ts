import type { FullSheet } from '@/lib/db/sheet';
import { type ComputedSheet, computeSheet } from '@/lib/rules';
import { type XpSummary, xpSummary } from '@/lib/rules/xp';
import type { PdfImage } from './images';
import { type NoteBlock, parseNotes } from './markdown';

/** Les images d'une fiche, lues avant la mise en page. */
export interface SheetAssets {
  avatar: PdfImage | null;
  /** Images des notes, par adresse (`null` : illisible). */
  images: Map<string, PdfImage | null>;
}

/** Tout ce que la mise en page d'une fiche lit : calculé une seule fois. */
export interface SheetModel {
  sheet: FullSheet;
  computed: ComputedSheet;
  xp: XpSummary;
  notes: NoteBlock[];
  assets: SheetAssets;
  /** Fuseau des dates du journal (le serveur tourne en UTC). */
  timeZone: string;
}

export const TIME_ZONE = 'Europe/Paris';

export const buildModel = (
  sheet: FullSheet,
  assets: SheetAssets = { avatar: null, images: new Map() },
  notes: NoteBlock[] = parseNotes(sheet.notes),
): SheetModel => ({
  sheet,
  computed: computeSheet(sheet),
  xp: xpSummary(sheet),
  notes,
  assets,
  timeZone: TIME_ZONE,
});

/** Nom affiché d'une fiche (« Sans nom » si vide). */
export const sheetName = (sheet: { name: string | null }) =>
  sheet.name?.trim() || 'Sans nom';
