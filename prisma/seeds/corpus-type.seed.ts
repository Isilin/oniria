import { PrismaClient } from '@prisma/client';

const seed = async (prisma: PrismaClient) => {
  await prisma.corpusType.upsert({
    create: { name: 'Origine' },
    where: { name: 'Origine' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Adaptation' },
    where: { name: 'Adaptation' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Espérance' },
    where: { name: 'Espérance' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Régime' },
    where: { name: 'Régime' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Apparence' },
    where: { name: 'Apparence' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Stature' },
    where: { name: 'Stature' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Membre' },
    where: { name: 'Membre' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Sensibilité' },
    where: { name: 'Sensibilité' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Immunité' },
    where: { name: 'Immunité' },
    update: {},
  });
  await prisma.corpusType.upsert({
    create: { name: 'Charme' },
    where: { name: 'Charme' },
    update: {},
  });
};

export default seed;
