/* eslint-disable @typescript-eslint/no-require-imports */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedsPath = path.join(__dirname, 'seeds');
  const files = fs
    .readdirSync(seedsPath)
    .filter((file) => file.endsWith('.seed.ts'));

  files.forEach(async (file) => {
    const seedFile = path.join(seedsPath, file);
    const { default: seedFn } = require(seedFile);
    await seedFn(prisma);
  });
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
