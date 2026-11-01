/* eslint-disable @typescript-eslint/no-require-imports */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Remplit les catalogues de règles (types de Corpus, potentiels,
 * compétences). Chaque seed utilise des upsert : on peut le relancer sans
 * créer de doublons ni toucher aux fiches.
 */
async function main() {
  const seedsPath = path.join(__dirname, 'seeds');
  const files = fs
    .readdirSync(seedsPath)
    .filter((file) => file.endsWith('.seed.ts'))
    .sort();

  // Séquentiel : chaque fichier attend la fin du précédent.
  for (const file of files) {
    const { default: seedFn } = require(path.join(seedsPath, file));
    await seedFn(prisma);
    console.log(`✔ ${file}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
