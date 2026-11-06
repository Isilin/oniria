import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Configuration de la CLI Prisma (migrations, seed, studio).
 * L'application, elle, se connecte via l'adaptateur pg (src/lib/db/prisma.ts).
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Connexion directe (sans pooler), nécessaire aux migrations.
    url:
      process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_PRISMA_URL,
  },
});
