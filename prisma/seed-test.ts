import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { ensureTestData } from '../src/lib/server/test-data';

/**
 * Personnages fictifs pour tester l'appli (jamais en production).
 * Les catalogues doivent être remplis avant : `yarn prisma:seed`.
 */
if (process.env.VERCEL_ENV === 'production') {
  console.error('Refusé : pas de données de test en production.');
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString:
      process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_PRISMA_URL,
  }),
});

ensureTestData(prisma)
  .then(async (created) => {
    console.log(
      created.length
        ? `✔ Personnages de test créés : ${created.join(', ')}`
        : '✔ Données de test déjà présentes.',
    );
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
