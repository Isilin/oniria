import { PrismaClient, SkillDegree, SkillType } from '@prisma/client';

const seed = async (prisma: PrismaClient) => {
  const graphism = await prisma.skill.upsert({
    where: { name_category: { name: 'Graphisme', category: 'Art' } },
    create: {
      name: 'Graphisme',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const painting = await prisma.skill.upsert({
    where: { name_category: { name: 'Peinture', category: 'Art' } },
    create: {
      name: 'Peinture',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: graphism },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Œuvre [Peinture]', category: 'Art' } },
    create: {
      name: 'Œuvre [Peinture]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: painting },
    },
    update: {},
  });

  const sculpting = await prisma.skill.upsert({
    where: { name_category: { name: 'Sculpture', category: 'Art' } },
    create: {
      name: 'Sculpture',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: graphism },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Œuvre [Sculpture]', category: 'Art' } },
    create: {
      name: 'Œuvre [Sculpture]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: sculpting },
    },
    update: {},
  });

  const music = await prisma.skill.upsert({
    where: { name_category: { name: 'Musique', category: 'Art' } },
    create: {
      name: 'Musique',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const instrument = await prisma.skill.upsert({
    where: { name_category: { name: 'Instrument', category: 'Art' } },
    create: {
      name: 'Instrument',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: music },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Œuvre [Instrument]', category: 'Art' } },
    create: {
      name: 'Œuvre [Instrument]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: instrument },
    },
    update: {},
  });

  const dance = await prisma.skill.upsert({
    where: { name_category: { name: 'Danse', category: 'Art' } },
    create: {
      name: 'Danse',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const dRegister = await prisma.skill.upsert({
    where: { name_category: { name: 'Registre [Danse]', category: 'Art' } },
    create: {
      name: 'Registre [Danse]',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: dance },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Œuvre [Danse]', category: 'Art' } },
    create: {
      name: 'Œuvre [Danse]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: dRegister },
    },
    update: {},
  });

  const theater = await prisma.skill.upsert({
    where: { name_category: { name: 'Théatre', category: 'Art' } },
    create: {
      name: 'Théatre',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const tRegister = await prisma.skill.upsert({
    where: { name_category: { name: 'Registre [Théatre]', category: 'Art' } },
    create: {
      name: 'Registre [Théatre]',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: theater },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Œuvre [Théatre]', category: 'Art' } },
    create: {
      name: 'Œuvre [Théatre]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: tRegister },
    },
    update: {},
  });

  const circus = await prisma.skill.upsert({
    where: { name_category: { name: 'Cirque', category: 'Art' } },
    create: {
      name: 'Cirque',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Jonglerie', category: 'Art' } },
    create: {
      name: 'Jonglerie',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: circus },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Mime', category: 'Art' } },
    create: {
      name: 'Mime',
      category: 'Art',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: circus },
    },
    update: {},
  });

  const crafting = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Artisanat' } },
    create: {
      name: '-',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const handiwork = await prisma.skill.upsert({
    where: { name_category: { name: 'Bricolage', category: 'Artisanat' } },
    create: {
      name: 'Bricolage',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: crafting },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Rafistolage', category: 'Artisanat' } },
    create: {
      name: 'Rafistolage',
      description:
        'Tant qu’il dispose des éléments nécessaires à la vague compréhension du mécanisme de l’engin, le personnage a toujours droit à un jet pour tenter de le remettre en état de marche. Evidemment, moins il le comprend, plus sa Mr devra être élevée.',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: handiwork },
    },
    update: {},
  });

  const forge = await prisma.skill.upsert({
    where: { name_category: { name: 'Forge', category: 'Artisanat' } },
    create: {
      name: 'Forge',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: crafting },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Œuvre [Forge]', category: 'Artisanat' } },
    create: {
      name: 'Œuvre [Forge]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: forge },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Alliage', category: 'Artisanat' } },
    create: {
      name: 'Alliage',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: forge },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Verrerie', category: 'Artisanat' } },
    create: {
      name: 'Verrerie',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: forge },
    },
    update: {},
  });

  const stonework = await prisma.skill.upsert({
    where: { name_category: { name: 'Maçonnerie', category: 'Artisanat' } },
    create: {
      name: 'Maçonnerie',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: crafting },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Œuvre [Maçonnerie]', category: 'Artisanat' },
    },
    create: {
      name: 'Œuvre [Maçonnerie]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: stonework },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Orfèvrerie', category: 'Artisanat' } },
    create: {
      name: 'Orfèvrerie',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: stonework },
    },
    update: {},
  });

  const tannery = await prisma.skill.upsert({
    where: { name_category: { name: 'Tannerie', category: 'Artisanat' } },
    create: {
      name: 'Tannerie',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: crafting },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Œuvre [Tannerie]', category: 'Artisanat' },
    },
    create: {
      name: 'Œuvre [Tannerie]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: tannery },
    },
    update: {},
  });

  const weaving = await prisma.skill.upsert({
    where: { name_category: { name: 'Tissage', category: 'Artisanat' } },
    create: {
      name: 'Tissage',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: crafting },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Œuvre [Tissage]', category: 'Artisanat' },
    },
    create: {
      name: 'Œuvre [Tissage]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: weaving },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Pigments', category: 'Artisanat' } },
    create: {
      name: 'Pigments',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: weaving },
    },
    update: {},
  });

  const wood = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Travail du bois', category: 'Artisanat' },
    },
    create: {
      name: 'Travail du bois',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: crafting },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Œuvre [Bois]', category: 'Artisanat' },
    },
    create: {
      name: 'Œuvre [Bois]',
      description:
        'Chaque œuvre dont le personnage acquiert la maîtrise peut désormais voir sa qualité augmenter au-delà de 60, selon les efforts qu’y investit le personnage.',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: wood },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Vernis', category: 'Artisanat' } },
    create: {
      name: 'Vernis',
      category: 'Artisanat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: wood },
    },
    update: {},
  });

  const melee = await prisma.skill.upsert({
    where: { name_category: { name: 'Corps à corps', category: 'Assassinat' } },
    create: {
      name: 'Corps à corps',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const barehand = await prisma.skill.upsert({
    where: { name_category: { name: 'Mains nues', category: 'Assassinat' } },
    create: {
      name: 'Mains nues',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: melee },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Coup mortel', category: 'Assassinat' } },
    create: {
      name: 'Coup mortel',
      description:
        'Comme avec les armes de type poignard ou dague, le personnage sait tuer à mains nues, si tant est qu’il ait une opportunité de le faire. Aussi, tout jet de résistance à ses coups mortels devra, pour être effectif, obtenir au moins un NmR de plus.',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: barehand },
    },
    update: {},
  });

  const weapon = await prisma.skill.upsert({
    where: { name_category: { name: 'Arme', category: 'Assassinat' } },
    create: {
      name: 'Arme',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: melee },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Point faible', category: 'Assassinat' } },
    create: {
      name: 'Point faible',
      description:
        'Les protections adverses ne sont plus prises en compte pour résister au jet de coup mortel, tant que l’assassin peut y déterminer une faille.',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: weapon },
    },
    update: {},
  });

  const poison = await prisma.skill.upsert({
    where: { name_category: { name: 'Poisons', category: 'Assassinat' } },
    create: {
      name: 'Poisons',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const poisonMake = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Poisons : Fabrication', category: 'Assassinat' },
    },
    create: {
      name: 'Poisons : Fabrication',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: poison },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Poisons : Rares', category: 'Assassinat' },
    },
    create: {
      name: 'Poisons : Rares',
      category: 'Assassinat',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: poisonMake },
    },
    update: {},
  });

  const athleticism = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Athlétisme' } },
    create: {
      name: '-',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const running = await prisma.skill.upsert({
    where: { name_category: { name: 'Course', category: 'Athlétisme' } },
    create: {
      name: 'Course',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: athleticism },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Endurance', category: 'Athlétisme' } },
    create: {
      name: 'Endurance',
      description:
        'Tant qu’il contrôle son rythme de course, le personnage ne s’épuise pas plus vite ainsi qu’en marchant d’un bon pas. Tous les malus reportés aux jets mesurant son effort sont divisés par deux.',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: running },
    },
    update: {},
  });

  const swimming = await prisma.skill.upsert({
    where: { name_category: { name: 'Natation', category: 'Athlétisme' } },
    create: {
      name: 'Natation',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: athleticism },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Apnée', category: 'Athlétisme' } },
    create: {
      name: 'Apnée',
      description:
        'Tant qu’il contrôle ses réserves d’air, le personnage divise par deux tous les malus reçus aux jets successifs pour ne pas respirer - ou s’évanouir.',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: swimming },
    },
    update: {},
  });

  const jumping = await prisma.skill.upsert({
    where: { name_category: { name: 'Saut', category: 'Athlétisme' } },
    create: {
      name: 'Saut',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: athleticism },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Acrobaties', category: 'Athlétisme' } },
    create: {
      name: 'Acrobaties',
      description:
        'Toutes les manœuvres acrobatiques tentées par le personnage voient leur Mr minimum requise diminuée d’un rang.',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: jumping },
    },
    update: {},
  });

  const climbing = await prisma.skill.upsert({
    where: { name_category: { name: 'Grimpe', category: 'Athlétisme' } },
    create: {
      name: 'Grimpe',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: {
        connect: athleticism,
      },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Escalade', category: 'Athlétisme' } },
    create: {
      name: 'Escalade',
      description:
        'Toutes les manœuvres d’escalade entreprises par le personnage voient leur Mr minimum requise diminuée d’un rang.',
      category: 'Athlétisme',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: climbing },
    },
    update: {},
  });

  const riding = await prisma.skill.upsert({
    where: { name_category: { name: 'Équitation', category: 'Conduite' } },
    create: {
      name: 'Équitation',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const grounded = await prisma.skill.upsert({
    where: { name_category: { name: 'Terrestre', category: 'Conduite' } },
    create: {
      name: 'Terrestre',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: riding },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Combat monté', category: 'Conduite' } },
    create: {
      name: 'Combat monté',
      description:
        'Le personnage peut faire usage de techniques dans le cadre de ces situations.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: grounded },
    },
    update: {},
  });

  const flying = await prisma.skill.upsert({
    where: { name_category: { name: 'Aviaire', category: 'Conduite' } },
    create: {
      name: 'Aviaire',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: riding },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Combat aérien', category: 'Conduite' } },
    create: {
      name: 'Combat aérien',
      description:
        'Le personnage peut faire usage de techniques dans le cadre de ces situations.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: flying },
    },
    update: {},
  });

  const aquatic = await prisma.skill.upsert({
    where: { name_category: { name: 'Aquatique', category: 'Conduite' } },
    create: {
      name: 'Aquatique',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: riding },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Combat sous-marin', category: 'Conduite' },
    },
    create: {
      name: 'Combat sous-marin',
      description:
        'Le personnage peut faire usage de techniques dans le cadre de ces situations.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: aquatic },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Tir monté', category: 'Conduite' },
    },
    create: {
      name: 'Tir monté',
      description:
        'Le personnage peut faire usage de techniques dans le cadre de ces situations.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: aquatic },
    },
    update: {},
  });

  const navigation = await prisma.skill.upsert({
    where: { name_category: { name: 'Navigation', category: 'Conduite' } },
    create: {
      name: 'Navigation',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const nTechnology = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Technologie [Navigation]', category: 'Conduite' },
    },
    create: {
      name: 'Technologie [Navigation]',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: navigation },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Maritime & fluviale', category: 'Conduite' },
    },
    create: {
      name: 'Maritime & fluviale',
      description:
        'Le personnage ne peut désormais plus s’égarer, en situation neutre, que sur une Ensaï. Tout jet de rencontre malencontreux peut désormais être relancé si le personnage réussit un jet avec une Mr suffisante, à la discrétion du maître de jeu.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: nTechnology },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Spatiale', category: 'Conduite' },
    },
    create: {
      name: 'Spatiale',
      description:
        'Le personnage ne peut désormais plus s’égarer, en situation neutre, que sur une Ensaï. Tout jet de rencontre malencontreux peut désormais être relancé si le personnage réussit un jet avec une Mr suffisante, à la discrétion du maître de jeu.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: nTechnology },
    },
    update: {},
  });

  const pilotage = await prisma.skill.upsert({
    where: { name_category: { name: 'Pilotage', category: 'Conduite' } },
    create: {
      name: 'Pilotage',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const pTechnology = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Technologie [Pilotage]', category: 'Conduite' },
    },
    create: {
      name: 'Technologie [Pilotage]',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: pilotage },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Aéronavale', category: 'Conduite' },
    },
    create: {
      name: 'Aéronavale',
      description:
        'En réussissant un jet avec une Mr suffisante, à la discrétion du maître de jeu et selon le type de technologie rencontré, le personnage peut tenter de comprendre intuitivement le fonctionnement grossier de tout appareil ou véhicule du type qu’il maîtrise.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: pTechnology },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Astronautique', category: 'Conduite' },
    },
    create: {
      name: 'Astronautique',
      description:
        'En réussissant un jet avec une Mr suffisante, à la discrétion du maître de jeu et selon le type de technologie rencontré, le personnage peut tenter de comprendre intuitivement le fonctionnement grossier de tout appareil ou véhicule du type qu’il maîtrise.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: pTechnology },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Terrestre', category: 'Conduite' },
    },
    create: {
      name: 'Terrestre',
      description:
        'En réussissant un jet avec une Mr suffisante, à la discrétion du maître de jeu et selon le type de technologie rencontré, le personnage peut tenter de comprendre intuitivement le fonctionnement grossier de tout appareil ou véhicule du type qu’il maîtrise.',
      category: 'Conduite',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: pTechnology },
    },
    update: {},
  });

  const oratory = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Éloquence' } },
    create: {
      name: '-',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const fraud = await prisma.skill.upsert({
    where: { name_category: { name: 'Tromperie', category: 'Éloquence' } },
    create: {
      name: 'Tromperie',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oratory },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Bluff', category: 'Éloquence' } },
    create: {
      name: 'Bluff',
      description:
        'Les situations où le personnage tente de mentir à un tiers peuvent désormais se résoudre autrement que par un jet. A la place et si il le souhaite, le joueur cache un d10 et annonce un nombre. Le maître du jeu doit déterminer s’il bluffe. S’il n’y parvient pas, le mensonge passe.',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: fraud },
    },
    update: {},
  });

  const persuasion = await prisma.skill.upsert({
    where: { name_category: { name: 'Persuasion', category: 'Éloquence' } },
    create: {
      name: 'Persuasion',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oratory },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Discours', category: 'Éloquence' } },
    create: {
      name: 'Discours',
      description:
        'Toute réussite critique sous ces maîtrises entraîne désormais un gain de renom automatique et immédiat. Entre autres conséquences.',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: persuasion },
    },
    update: {},
  });

  const appeal = await prisma.skill.upsert({
    where: { name_category: { name: 'Séduction', category: 'Éloquence' } },
    create: {
      name: 'Séduction',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oratory },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Courtise', category: 'Éloquence' } },
    create: {
      name: 'Courtise',
      description:
        'Toute réussite critique sous ces maîtrises entraîne désormais un gain de renom automatique et immédiat. Entre autres conséquences.',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: appeal },
    },
    update: {},
  });

  const intimidation = await prisma.skill.upsert({
    where: { name_category: { name: 'Intimidation', category: 'Éloquence' } },
    create: {
      name: 'Intimidation',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: oratory },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Coercition', category: 'Éloquence' } },
    create: {
      name: 'Coercition',
      description:
        'Toute réussite critique sous ces maîtrises entraîne désormais un gain de renom automatique et immédiat. Entre autres conséquences.',
      category: 'Éloquence',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: intimidation },
    },
    update: {},
  });

  const learning = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Érudition' } },
    create: {
      name: '-',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const laws = await prisma.skill.upsert({
    where: { name_category: { name: 'Lois', category: 'Érudition' } },
    create: {
      name: 'Lois',
      description:
        'Le personnage est désormais instruit dans les arcanes de ces connaissances respectives, et plus en tant qu’amateur. Libre à lui de compter sur le maître de jeu pour lui fournir les informations qu’il est censé parfaitement connaître.',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: learning },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Âmée', category: 'Érudition' } },
    create: {
      name: 'Âmée',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Biologie', category: 'Érudition' } },
    create: {
      name: 'Biologie',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Chimie', category: 'Érudition' } },
    create: {
      name: 'Chimie',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Corpus', category: 'Érudition' } },
    create: {
      name: 'Corpus',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Cosmologie', category: 'Érudition' } },
    create: {
      name: 'Cosmologie',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Maths', category: 'Érudition' } },
    create: {
      name: 'Maths',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Physique', category: 'Érudition' } },
    create: {
      name: 'Physique',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Spyrée', category: 'Érudition' } },
    create: {
      name: 'Spyrée',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: laws },
    },
    update: {},
  });

  const folk = await prisma.skill.upsert({
    where: { name_category: { name: 'Peuple', category: 'Érudition' } },
    create: {
      name: 'Peuple',
      description:
        'Le personnage est désormais instruit dans les arcanes de ces connaissances respectives, et plus en tant qu’amateur. Libre à lui de compter sur le maître de jeu pour lui fournir les informations qu’il est censé parfaitement connaître.',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: learning },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Culture', category: 'Érudition' } },
    create: {
      name: 'Culture',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: folk },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Histoire', category: 'Érudition' } },
    create: {
      name: 'Histoire',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: folk },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Technologie', category: 'Érudition' } },
    create: {
      name: 'Technologie',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: folk },
    },
    update: {},
  });

  const world = await prisma.skill.upsert({
    where: { name_category: { name: 'Monde', category: 'Érudition' } },
    create: {
      name: 'Monde',
      description:
        'Le personnage est désormais instruit dans les arcanes de ces connaissances respectives, et plus en tant qu’amateur. Libre à lui de compter sur le maître de jeu pour lui fournir les informations qu’il est censé parfaitement connaître.',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: learning },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Géographie', category: 'Érudition' } },
    create: {
      name: 'Géographie',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: world },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Écosystème', category: 'Érudition' } },
    create: {
      name: 'Écosystème',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: world },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Mythes & Légendes', category: 'Érudition' },
    },
    create: {
      name: 'Mythes & Légendes',
      category: 'Érudition',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: world },
    },
    update: {},
  });

  const stealth = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Furtivité' } },
    create: {
      name: '-',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const move = await prisma.skill.upsert({
    where: { name_category: { name: 'Mouvement', category: 'Furtivité' } },
    create: {
      name: 'Mouvement',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: stealth },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Course', category: 'Furtivité' } },
    create: {
      name: 'Course',
      description:
        'Le personnage sait se déplacer rapidement sans voir son jet de discrétion écoper d’un malus.',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: move },
    },
    update: {},
  });

  const noise = await prisma.skill.upsert({
    where: { name_category: { name: 'Bruit', category: 'Furtivité' } },
    create: {
      name: 'Bruit',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: stealth },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Leurres', category: 'Furtivité' } },
    create: {
      name: 'Leurres',
      description:
        'Tant qu’il dispose d’un bruit pour couvrir le sien, le personnage peut remplacer ses jets de discrétion par tromperie (Et éviter ainsi les malus d’encombrement liés).',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: noise },
    },
    update: {},
  });

  const decoration = await prisma.skill.upsert({
    where: { name_category: { name: 'Décor', category: 'Furtivité' } },
    create: {
      name: 'Décor',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: stealth },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Disparition', category: 'Furtivité' } },
    create: {
      name: 'Disparition',
      description:
        'Tant qu’il dispose d’un élément du décor apte à le masquer entièrement, ne serait-ce qu’un instant, et sur un jet de discrétion en opposition réussi, le personnage peut forcer quiconque l’observait à le perdre de vue.',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: decoration },
    },
    update: {},
  });

  const look = await prisma.skill.upsert({
    where: { name_category: { name: 'Apparence', category: 'Furtivité' } },
    create: {
      name: 'Apparence',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: stealth },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Contrefaçon', category: 'Furtivité' } },
    create: {
      name: 'Contrefaçon',
      description:
        'Avec de la préparation, le personnage peut accumuler de la Mr qui lui sera ajoutée lors de ses jets de tromperie/discrétion, une fois en situation. Attitude, voix, matériel, cela peut s’appliquer à peu près à n’importe quoi.',
      category: 'Furtivité',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: look },
    },
    update: {},
  });

  const thieving = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Larcin' } },
    create: {
      name: '-',
      category: 'Larcin',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const trick = await prisma.skill.upsert({
    where: { name_category: { name: 'Escamotage', category: 'Larcin' } },
    create: {
      name: 'Escamotage',
      category: 'Larcin',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: thieving },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Tire-laine', category: 'Larcin' } },
    create: {
      name: 'Tire-laine',
      description:
        'Lorsqu’il cible une victime distraite ou occupée, le personnage ajoute désormais un NmR à ses jets de larcin. Il maîtrise l’art précieux de l’instant opportun.',
      category: 'Larcin',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: trick },
    },
    update: {},
  });

  const hooking = await prisma.skill.upsert({
    where: { name_category: { name: 'Crochetage', category: 'Larcin' } },
    create: {
      name: 'Crochetage',
      category: 'Larcin',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: thieving },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Passe-partout', category: 'Larcin' } },
    create: {
      name: 'Passe-partout',
      description:
        'Outils de crochetage ou pièges, selon, le personnage sait désormais les improviser à partir de peu de choses. Il est assez expert dans ces arts pour ne plus avoir besoin d’outils forcément adaptés.',
      category: 'Larcin',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: hooking },
    },
    update: {},
  });

  const trap = await prisma.skill.upsert({
    where: { name_category: { name: 'Pièges', category: 'Larcin' } },
    create: {
      name: 'Pièges',
      category: 'Larcin',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: thieving },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Chausse-trappes', category: 'Larcin' } },
    create: {
      name: 'Chausse-trappes',
      description:
        'Outils de crochetage ou pièges, selon, le personnage sait désormais les improviser à partir de peu de choses. Il est assez expert dans ces arts pour ne plus avoir besoin d’outils forcément adaptés.',
      category: 'Larcin',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: trap },
    },
    update: {},
  });

  const medicine = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Médecine' } },
    create: {
      name: '-',
      category: 'Médecine',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const firstAid = await prisma.skill.upsert({
    where: { name_category: { name: 'Premiers soins', category: 'Médecine' } },
    create: {
      name: 'Premiers soins',
      category: 'Médecine',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: medicine },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Chirurgie', category: 'Médecine' } },
    create: {
      name: 'Chirurgie',
      description:
        'Dans un cas comme dans l’autre, s’y frotter sans un enseignement solide au préalable finira très mal.',
      category: 'Médecine',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: firstAid },
    },
    update: {},
  });

  const diseases = await prisma.skill.upsert({
    where: { name_category: { name: 'Maladie', category: 'Médecine' } },
    create: {
      name: 'Maladie',
      category: 'Médecine',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: medicine },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Remèdes', category: 'Médecine' } },
    create: {
      name: 'Remèdes',
      category: 'Médecine',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: diseases },
    },
    update: {},
  });

  const observation = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Observation' } },
    create: {
      name: '-',
      category: 'Observation',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const research = await prisma.skill.upsert({
    where: { name_category: { name: 'Recherche', category: 'Observation' } },
    create: {
      name: 'Recherche',
      category: 'Observation',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: observation },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Intuitions', category: 'Observation' } },
    create: {
      name: 'Intuitions',
      description:
        'Entre autres effets sympathiques, le personnage diminue d’un NmR la Mr requise pour trouver quelque chose, lors d’une recherche.',
      category: 'Observation',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: research },
    },
    update: {},
  });

  const vigilance = await prisma.skill.upsert({
    where: { name_category: { name: 'Vigilance', category: 'Observation' } },
    create: {
      name: 'Vigilance',
      category: 'Observation',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: observation },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Sixième sens', category: 'Observation' } },
    create: {
      name: 'Sixième sens',
      description:
        'Entre autres effets sympathiques, le personnage obtient forcément une réussite simple à tout jet pratiqué en secret par le maître de jeu pour définir s’il se sent menacé (Cela ne prend aucunement en compte le fait de définir ladite menace).',
      category: 'Observation',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: vigilance },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Mysticisme', category: 'Observation' } },
    create: {
      name: 'Mysticisme',
      description:
        'Le personnage peut, sur un jet réussi, réussir à deviner les altérations subtiles de la réalité, de manière intuitive et selon la Mr obtenue. Il ne pourra néanmoins jamais obtenir davantage ainsi que l\'impression qu\'il se passe "un truc mystique".',
      category: 'Observation',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: vigilance },
    },
    update: {},
  });

  const survival = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Survie' } },
    create: {
      name: '-',
      category: 'Survie',
      type: SkillType.GENERAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const orientation = await prisma.skill.upsert({
    where: { name_category: { name: 'Orientation', category: 'Survie' } },
    create: {
      name: 'Orientation',
      category: 'Survie',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: survival },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Repères', category: 'Survie' } },
    create: {
      name: 'Repères',
      description:
        "S'il est déjà passé une fois par là en pleine possession de ses sens, le personnage saura y retourner.",
      category: 'Survie',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: orientation },
    },
    update: {},
  });

  const livelihood = await prisma.skill.upsert({
    where: { name_category: { name: 'Subsistance', category: 'Survie' } },
    create: {
      name: 'Subsistance',
      category: 'Survie',
      type: SkillType.GENERAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: survival },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Pistage', category: 'Survie' } },
    create: {
      name: 'Pistage',
      description:
        'Sans cette maîtrise, un taureau dans les hautes herbes peut-être, les six loups qui le pistent également, non.',
      category: 'Survie',
      type: SkillType.GENERAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: livelihood },
    },
    update: {},
  });
};

export default seed;
