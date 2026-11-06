import { sanitizeFilename } from '@/lib/helpers/download';
import { renderTeamPdf } from '@/lib/pdf/render';
import { handleFile, HttpError, requireAdmin } from '@/lib/server/api';
import { findTeam } from '@/lib/server/queries';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// Toutes les fiches d'une table : plus long qu'une seule.
export const maxDuration = 60;

/** Toutes les fiches d'une table en un PDF, après la vue d'ensemble (MJ). */
export const GET = (req: NextRequest, { params: paramsPromise }: Params) =>
  handleFile(async () => {
    const params = await paramsPromise;
    await requireAdmin();
    const team = await findTeam(params.id);
    if (!team) throw new HttpError(404, 'Table introuvable.');
    if (team.members.length === 0) {
      throw new HttpError(400, 'Aucun personnage à cette table.');
    }
    const body = await renderTeamPdf(team);
    return {
      body,
      filename: `${sanitizeFilename(team.name, 'Table')}.pdf`,
      type: 'application/pdf',
    };
  });
