import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Les valeurs calculées (facultés, existences…) sont dans src/lib/rules,
// partagées entre le client et le serveur.

const createClient = () =>
  new PrismaClient({
    // Connexion via le pooler (POSTGRES_PRISMA_URL) en production.
    adapter: new PrismaPg({
      connectionString:
        process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL_NON_POOLING,
    }),
  });

declare const globalThis: {
  prismaGlobal: ReturnType<typeof createClient>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? createClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
