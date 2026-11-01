import { PrismaClient } from '@prisma/client';

// Les valeurs calculées (facultés, existences…) sont dans src/lib/rules,
// partagées entre le client et le serveur.

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? new PrismaClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
