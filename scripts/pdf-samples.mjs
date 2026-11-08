// Échantillons de l'export PDF, à relire après un changement de mise en
// page : compose les fiches fictives de src/lib/pdf/fixtures.ts (Lyse,
// Corwin, le Colosse, une fiche vide, une fiche chargée) et la table de
// test, et les écrit dans .pdf-samples/ (ignoré par git).
//
//   node scripts/pdf-samples.mjs
import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, '.pdf-samples');

const result = spawnSync(
  process.execPath,
  [
    path.join(root, '.yarn/releases/yarn-4.5.1.cjs'),
    'vitest',
    'run',
    'src/lib/pdf/render.test.ts',
  ],
  {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, PDF_SAMPLES_DIR: out },
  },
);
if (result.status !== 0) process.exit(result.status ?? 1);

for (const name of readdirSync(out).filter((f) => f.endsWith('.pdf'))) {
  const size = statSync(path.join(out, name)).size;
  console.log(
    `${path.join('.pdf-samples', name)}  ${Math.round(size / 1024)} Ko`,
  );
}
