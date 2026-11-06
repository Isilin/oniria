import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { colosse, corwin, empty, heavy, lyse, team } from './fixtures';
import { type ImageLoader, normalizeImage } from './images';
import { renderSheetPdf, renderTeamPdf } from './render';

/**
 * Rendu des PDF à partir de fiches fictives. Avec PDF_SAMPLES_DIR, les
 * fichiers sont aussi écrits sur le disque pour les relire
 * (scripts/pdf-samples.mjs).
 */

const samples = process.env.PDF_SAMPLES_DIR;

const picture = sharp({
  create: {
    width: 480,
    height: 640,
    channels: 3,
    background: { r: 120, g: 90, b: 60 },
  },
})
  .png()
  .toBuffer();

/** Toute image se lit, sauf la carte des notes (adresse morte). */
const fakeLoader: ImageLoader = async (url, size) =>
  url.includes('carte') ? null : normalizeImage(await picture, size);

const save = (name: string, pdf: Buffer) => {
  if (!samples) return;
  mkdirSync(samples, { recursive: true });
  writeFileSync(path.join(samples, name), pdf);
};

const isPdf = (pdf: Buffer) => pdf.subarray(0, 5).toString() === '%PDF-';

describe('export PDF', () => {
  it.each([
    ['lyse.pdf', lyse],
    ['colosse.pdf', colosse],
    ['vide.pdf', empty],
    ['corwin.pdf', corwin],
    ['grande-fiche.pdf', heavy],
  ])(
    'compose %s',
    async (name, make) => {
      const started = Date.now();
      const pdf = await renderSheetPdf(make(), { loadImage: fakeLoader });
      expect(isPdf(pdf)).toBe(true);
      expect(pdf.length).toBeLessThan(1_500_000);
      save(name, pdf);
      if (samples)
        console.log(name, pdf.length, 'octets', Date.now() - started, 'ms');
    },
    60_000,
  );

  it('compose une table avec sa page de garde', async () => {
    const pdf = await renderTeamPdf(team(), {
      loadImage: fakeLoader,
      now: new Date(Date.UTC(2026, 10, 6, 12)),
    });
    expect(isPdf(pdf)).toBe(true);
    save('table-de-test.pdf', pdf);
  }, 60_000);

  it('exporte sans images quand aucune ne se lit', async () => {
    const pdf = await renderSheetPdf(lyse(), { loadImage: async () => null });
    expect(isPdf(pdf)).toBe(true);
  }, 60_000);
});
