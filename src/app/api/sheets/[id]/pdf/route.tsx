import { sanitizeFilename } from '@/lib/helpers/download';
import { renderSheetPdf } from '@/lib/pdf/render';
import { handleFile, HttpError, requireUser } from '@/lib/server/api';
import { findSheet } from '@/lib/server/queries';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// Composer le PDF prend quelques secondes (polices, images distantes).
export const maxDuration = 30;

/**
 * La fiche complète en PDF. Comme sa lecture, l'export est ouvert à toute
 * personne connectée : chacun·e voit toutes les fiches.
 */
export const GET = (req: NextRequest, { params: paramsPromise }: Params) =>
  handleFile(async () => {
    const params = await paramsPromise;
    await requireUser();
    const sheet = await findSheet(params.id);
    if (!sheet) throw new HttpError(404, 'Fiche introuvable.');
    const body = await renderSheetPdf(sheet);
    return {
      body,
      filename: `${sanitizeFilename(sheet.name, 'Fiche')}.pdf`,
      type: 'application/pdf',
    };
  });
