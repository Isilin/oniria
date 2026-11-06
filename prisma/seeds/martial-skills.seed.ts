import { PrismaClient, SkillDegree, SkillType } from '@prisma/client';

const seed = async (prisma: PrismaClient) => {
  const wrestling = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Lutte' } },
    create: {
      name: '-',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Poings', category: 'Lutte' } },
    create: {
      name: 'Poings',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: wrestling },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Pieds', category: 'Lutte' } },
    create: {
      name: 'Pieds',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: wrestling },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Esquive', category: 'Lutte' } },
    create: {
      name: 'Esquive',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: wrestling },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Parade', category: 'Lutte' } },
    create: {
      name: 'Parade',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: wrestling },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Prise', category: 'Lutte' } },
    create: {
      name: 'Prise',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: wrestling },
    },
    update: {},
  });

  const oneHand = await prisma.skill.upsert({
    where: { name_category: { name: 'Une main', category: 'Lutte' } },
    create: {
      name: 'Une main',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Dagues', category: 'Lutte' } },
    create: {
      name: 'Dagues',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oneHand },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Épées', category: 'Lutte' } },
    create: {
      name: 'Épées',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oneHand },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Haches', category: 'Lutte' } },
    create: {
      name: 'Haches',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oneHand },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Masses', category: 'Lutte' } },
    create: {
      name: 'Masses',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oneHand },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Articulées', category: 'Lutte' } },
    create: {
      name: 'Articulées',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oneHand },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Hast', category: 'Lutte' } },
    create: {
      name: 'Hast',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oneHand },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Boucliers', category: 'Lutte' } },
    create: {
      name: 'Boucliers',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oneHand },
    },
    update: {},
  });

  const twoHands = await prisma.skill.upsert({
    where: { name_category: { name: 'Deux mains', category: 'Lutte' } },
    create: {
      name: 'Deux mains',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Épées [Deux mains]', category: 'Lutte' } },
    create: {
      name: 'Épées [Deux mains]',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: twoHands },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Haches [Deux mains]', category: 'Lutte' },
    },
    create: {
      name: 'Haches [Deux mains]',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: twoHands },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Masses [Deux mains]', category: 'Lutte' },
    },
    create: {
      name: 'Masses [Deux mains]',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: twoHands },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Articulées [Deux mains]', category: 'Lutte' },
    },
    create: {
      name: 'Articulées [Deux mains]',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: twoHands },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Hast [Deux mains]', category: 'Lutte' } },
    create: {
      name: 'Hast [Deux mains]',
      category: 'Lutte',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: twoHands },
    },
    update: {},
  });

  const ambidextrous = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Ambidextrie' } },
    create: {
      name: '-',
      category: 'Ambidextrie',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Lutte', category: 'Ambidextrie' } },
    create: {
      name: 'Lutte',
      category: 'Ambidextrie',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: ambidextrous },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Arme blanche', category: 'Ambidextrie' } },
    create: {
      name: 'Arme blanche',
      category: 'Ambidextrie',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: ambidextrous },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Arme à projectiles', category: 'Ambidextrie' },
    },
    create: {
      name: 'Arme à projectiles',
      category: 'Ambidextrie',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: ambidextrous },
    },
    update: {},
  });

  const spray = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Jet' } },
    create: {
      name: '-',
      category: 'Jet',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Arme', category: 'Jet' } },
    create: {
      name: 'Arme',
      category: 'Jet',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: spray },
    },
    update: {},
  });

  const range = await prisma.skill.upsert({
    where: {
      name_category: { name: 'À cordes', category: 'Armes à projectiles' },
    },
    create: {
      name: 'À cordes',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Arc', category: 'Armes à projectiles' } },
    create: {
      name: 'Arc',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: range },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Arbalète', category: 'Armes à projectiles' },
    },
    create: {
      name: 'Arbalète',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: range },
    },
    update: {},
  });

  const guns = await prisma.skill.upsert({
    where: {
      name_category: {
        name: 'Armes à feu diverses',
        category: 'Armes à projectiles',
      },
    },
    create: {
      name: 'Armes à feu diverses',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'De poing', category: 'Armes à projectiles' },
    },
    create: {
      name: 'De poing',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: guns },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: "D'épaule", category: 'Armes à projectiles' },
    },
    create: {
      name: "D'épaule",
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: guns },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Automatique', category: 'Armes à projectiles' },
    },
    create: {
      name: 'Automatique',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: guns },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Lourdes', category: 'Armes à projectiles' },
    },
    create: {
      name: 'Lourdes',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: guns },
    },
    update: {},
  });

  const energy = await prisma.skill.upsert({
    where: {
      name_category: {
        name: 'Armes à énergie diverses',
        category: 'Armes à projectiles',
      },
    },
    create: {
      name: 'Armes à énergie diverses',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: {
        name: 'De poing [énergie]',
        category: 'Armes à projectiles',
      },
    },
    create: {
      name: 'De poing [énergie]',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: energy },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: {
        name: "D'épaule [énergie]",
        category: 'Armes à projectiles',
      },
    },
    create: {
      name: "D'épaule [énergie]",
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: energy },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: {
        name: 'Automatique [énergie]',
        category: 'Armes à projectiles',
      },
    },
    create: {
      name: 'Automatique [énergie]',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: energy },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: {
        name: 'Lourdes [énergie]',
        category: 'Armes à projectiles',
      },
    },
    create: {
      name: 'Lourdes [énergie]',
      category: 'Armes à projectiles',
      type: SkillType.MARTIAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: energy },
    },
    update: {},
  });
};

export default seed;
