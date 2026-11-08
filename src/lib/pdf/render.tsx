'use no memo';

import { renderToBuffer } from '@react-pdf/renderer';
import type { FullSheet, TeamWithMembers } from '@/lib/db/sheet';
import { SheetDocument, TeamDocument } from './documents';
import { registerFonts } from './fonts';
import { type ImageLoader, loadImage, pool } from './images';
import { noteImageUrls, parseNotes } from './markdown';
import { buildModel, type SheetAssets, type SheetModel } from './model';

/**
 * Composition des PDF côté serveur. Les images sont lues avant la mise en
 * page (react-pdf ne doit rien aller chercher lui-même), en parallèle,
 * bornées ; une image illisible n'empêche jamais l'export.
 *
 * Les composants du PDF n'ont ni état ni hook : react-pdf a sa propre copie
 * de React (paquet externe), et le React Compiler est désactivé sur ces
 * fichiers (`'use no memo'`) pour qu'il n'y glisse pas les siens.
 */

export interface RenderOptions {
  /** Lecture des images (remplaçable dans les tests). */
  loadImage?: ImageLoader;
  /** Date de l'export (page de garde d'une table). */
  now?: Date;
}

/** Côté du portrait, en pixels (cadre de 72 × 81 pt). */
const AVATAR_SIZE = 320;
/** Images des notes : toute la largeur de la feuille. */
const NOTE_IMAGE_SIZE = 900;
/** Au plus tant d'images de notes par fiche. */
const NOTE_IMAGES_MAX = 8;
/** Lectures en parallèle. */
const CONCURRENCY = 6;

type Job = { url: string; size: number; key: string };

const prepare = async (
  sheets: FullSheet[],
  load: ImageLoader,
): Promise<SheetModel[]> => {
  const notes = sheets.map((sheet) => parseNotes(sheet.notes));
  const jobs: Job[][] = sheets.map((sheet, i) => [
    ...(sheet.avatar
      ? [{ url: sheet.avatar, size: AVATAR_SIZE, key: 'avatar' }]
      : []),
    ...[...new Set(noteImageUrls(notes[i]))]
      .slice(0, NOTE_IMAGES_MAX)
      .map((url) => ({ url, size: NOTE_IMAGE_SIZE, key: url })),
  ]);
  const flat = jobs.flatMap((list, sheet) =>
    list.map((job) => ({ job, sheet })),
  );
  const images = await pool(flat, CONCURRENCY, ({ job }) =>
    load(job.url, job.size).catch(() => null),
  );
  return sheets.map((sheet, i) => {
    const assets: SheetAssets = { avatar: null, images: new Map() };
    flat.forEach(({ job, sheet: owner }, index) => {
      if (owner !== i) return;
      if (job.key === 'avatar') assets.avatar = images[index];
      else assets.images.set(job.url, images[index]);
    });
    return buildModel(sheet, assets, notes[i]);
  });
};

/** Le PDF d'une fiche complète. */
export const renderSheetPdf = async (
  sheet: FullSheet,
  { loadImage: load = loadImage }: RenderOptions = {},
) => {
  registerFonts();
  const [model] = await prepare([sheet], load);
  return renderToBuffer(<SheetDocument model={model} />);
};

/** Le PDF de toutes les fiches d'une table, avec sa page de garde. */
export const renderTeamPdf = async (
  team: Pick<TeamWithMembers, 'name' | 'members'>,
  { loadImage: load = loadImage, now = new Date() }: RenderOptions = {},
) => {
  registerFonts();
  const models = await prepare(team.members, load);
  return renderToBuffer(
    <TeamDocument
      name={team.name?.trim() || 'Table sans nom'}
      models={models}
      exportedAt={now}
    />,
  );
};
