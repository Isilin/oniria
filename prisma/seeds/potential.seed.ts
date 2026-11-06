import { PrismaClient } from '@prisma/client';

const seed = async (prisma: PrismaClient) => {
  const element = await prisma.potentialCategory.upsert({
    where: { name: 'Élément' },
    create: { name: 'Élément' },
    update: {},
  });

  const fire = await prisma.potentialType.upsert({
    where: { name: 'Le Feu' },
    create: { name: 'Le Feu', categoryId: element.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Flamme' },
    create: {
      typeId: fire.id,
      name: 'Flamme',
      description:
        'En appeler aux flammes, les manipuler. Inflige des dégâts de brûlure sur la durée, principalement.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Chaleur' },
    create: {
      typeId: fire.id,
      name: 'Chaleur',
      description:
        'Altérer la température des choses, les pousser à la combustion, les faire bouillir ou les geler.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Passion' },
    create: {
      typeId: fire.id,
      name: 'Passion',
      description:
        'Jouer sur les intérêts des esprits, attiser ou distraire leurs implications, déchaîner leurs passions ou les éteindre.',
    },
    update: {},
  });

  const air = await prisma.potentialType.upsert({
    where: { name: "L'air" },
    create: { name: "L'air", categoryId: element.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Vent' },
    create: {
      typeId: air.id,
      name: 'Vent',
      description: 'En appeler aux vents, les diriger, les guider.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Gravité' },
    create: {
      typeId: air.id,
      name: 'Gravité',
      description:
        'Altérer la gravité des choses, leur donner du poids ou les alléger.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Arcane' },
    create: {
      typeId: air.id,
      name: 'Arcane',
      description:
        "Apprendre à questionner les vents, à prêter aux oreilles aux nouvelles, aux murmures et aux secrets qu'ils emportent.",
    },
    update: {},
  });

  const water = await prisma.potentialType.upsert({
    where: { name: "L'eau" },
    create: { name: "L'eau", categoryId: element.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Flot' },
    create: {
      typeId: water.id,
      name: 'Flot',
      description: "En appeler à l'eau, la manipuler, la contrôler.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Trouble' },
    create: {
      typeId: water.id,
      name: 'Trouble',
      description:
        'Altérer la surface des choses, les rendre opaques ou transparentes, ternes ou réfléchissantes.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Humeur' },
    create: {
      typeId: water.id,
      name: 'Humeur',
      description:
        'Jouer sur les humeurs des esprits, les échanger, les induire ou les chasser.',
    },
    update: {},
  });

  const earth = await prisma.potentialType.upsert({
    where: { name: 'La Terre' },
    create: { name: 'La Terre', categoryId: element.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Pierre' },
    create: {
      typeId: earth.id,
      name: 'Pierre',
      description:
        "En appeler à la pierre, la tordre et la manipuler, la déplacer ou l'animer.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Roche' },
    create: {
      typeId: earth.id,
      name: 'Roche',
      description:
        'Altérer la solidité des choses, les rendre plus dures, ou plus molles.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Fondation' },
    create: {
      typeId: earth.id,
      name: 'Fondation',
      description:
        'Jouer sur la stabilité des choses, des lieux, des relations et des ouvrages.',
    },
    update: {},
  });

  const concept = await prisma.potentialCategory.upsert({
    where: { name: 'Concept' },
    create: { name: 'Concept' },
    update: {},
  });

  const death = await prisma.potentialType.upsert({
    where: { name: 'La Mort' },
    create: { name: 'La Mort', categoryId: concept.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Nécrose' },
    create: {
      typeId: death.id,
      name: 'Nécrose',
      description:
        'Faire mourir tout ce qui vit, lentement, éteindre ses chairs. Inflige des dégâts qui ne pourront guérir que de façon naturelle.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Morte-vivante' },
    create: {
      typeId: death.id,
      name: 'Morte-vivante',
      description:
        'Animer tout ce qui est mort, déserté et laissé à pourrir. Relever des squelettes, des zombies, des cadavres décérébrés et sans âme pour leur commander.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Abandon' },
    create: {
      typeId: death.id,
      name: 'Abandon',
      description:
        "Laisser progressivement derrière soi tout ce qui fait du spyre un être vivant, ses fardeaux, sa vie, son corps, son esprit et son âme finalement, pour continuer, encore et toujours, malgré tout ce qu'on a perdu. Arpenter le chemin de la Non-Vie à jamais.",
    },
    update: {},
  });

  const order = await prisma.potentialType.upsert({
    where: { name: "L'Ordre" },
    create: { name: "L'Ordre", categoryId: concept.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Gloire' },
    create: {
      typeId: order.id,
      name: 'Gloire',
      description:
        "Bénir ou exalter, se faire ou nommer celui qui saura ramener l'ordre et la paix, la stagnation et l'inertie. Pouvoir lutter contre l'immatériel, pouvoir tuer ce qui ne devrait mourir. Maîtriser le pouvoir de rappeler à tous les petits tricheurs de la Spirale que L'UNIVERS A DES RÈGLES.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Stase' },
    create: {
      typeId: order.id,
      name: 'Stase',
      description:
        "Empêcher, interdire le changement. Typiquement, bloquer toute magie, dresser des boucliers de spyrée ou des zones d'interdiction.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Pardon' },
    create: {
      typeId: order.id,
      name: 'Pardon',
      description:
        "Rendre à quelque chose son état 'normal' ou naturel. Remettre un peu d'ordre là où tout fut bouleversé. En pratique, guérir les plaies, les désordres et les blessures.",
    },
    update: {},
  });

  const life = await prisma.potentialType.upsert({
    where: { name: 'La Vie' },
    create: { name: 'La Vie', categoryId: concept.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Mue' },
    create: {
      typeId: life.id,
      name: 'Mue',
      description:
        'Principe mâle de la spyrée de Vie, réservée aux garçons, qui permet de faire pousser de plus gros muscles, des griffes, des ailes, des écailles, de métamorphoser les chairs temporairement.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Engeance' },
    create: {
      typeId: life.id,
      name: 'Engeance',
      description:
        "Principe femelle de la spyrée de Vie, réservée aux filles, qui permet de donner naissance à d'autres êtres vivants de façon spontanée, de les concevoir et leur commander, familiers ou symbiotes.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Toile' },
    create: {
      typeId: life.id,
      name: 'Toile',
      description:
        'Principe spirituel de la spyrée de Vie, accès à la grande toile tissée entre tous les esprits, entre toutes les consciences. Télépathie, partage de compétences, de connaissances.',
    },
    update: {},
  });

  const chaos = await prisma.potentialType.upsert({
    where: { name: 'Le Chaos' },
    create: { name: 'Le Chaos', categoryId: concept.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Schisme' },
    create: {
      typeId: chaos.id,
      name: 'Schisme',
      description:
        'Affinité avec la rupture, le bris, le fracas. des choses matérielles. Aptitude à les inciter, les provoquer.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Discorde' },
    create: {
      typeId: chaos.id,
      name: 'Discorde',
      description:
        'Affinité avec la zizanie, la mésentente, la dispute et la guerre. Aptitude à les inciter, les provoquer.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Néant' },
    create: {
      typeId: chaos.id,
      name: 'Néant',
      description:
        "Affinité avec l'entropie, l'opposé de tout ce qui est. Aptitude à générer de petits trous noirs modelables à l'envie mais dénués de toute attraction gravitationnelle.",
    },
    update: {},
  });

  const law = await prisma.potentialCategory.upsert({
    where: { name: 'Loi' },
    create: { name: 'Loi' },
    update: {},
  });

  const energy = await prisma.potentialType.upsert({
    where: { name: "L'Énergie" },
    create: { name: "L'Énergie", categoryId: law.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Onde' },
    create: {
      typeId: energy.id,
      name: 'Onde',
      description:
        "En appeler à l'énergie matérielle, la force cinétique, pour la contrôler et la diriger, pour assaillir ou bloquer.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Ether' },
    create: {
      typeId: energy.id,
      name: 'Ether',
      description:
        "En appeler à l'énergie subtile, la spyrée, pour la dévier, la repousser ou l'éteindre. Tricher avec la triche.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Astral' },
    create: {
      typeId: energy.id,
      name: 'Astral',
      description: '???',
    },
    update: {},
  });

  const space = await prisma.potentialType.upsert({
    where: { name: "L'Espace" },
    create: { name: "L'Espace", categoryId: law.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Correspondance' },
    create: {
      typeId: space.id,
      name: 'Correspondance',
      description:
        'Affinité avec les espaces entre les choses, leur position sur la trame. Téléportations.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Ubiquité' },
    create: {
      typeId: space.id,
      name: 'Ubiquité',
      description:
        'Affinité avec la place des choses sur la trame, à en occuper plusieurs en même temps. Dédoublements.',
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Omniscience' },
    create: {
      typeId: space.id,
      name: 'Omniscience',
      description:
        "Projection mentale dans l'espace. Capacité à projeter ses sens ailleurs.",
    },
    update: {},
  });

  const matter = await prisma.potentialType.upsert({
    where: { name: 'La Matière' },
    create: { name: 'La Matière', categoryId: law.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Transformation' },
    create: {
      typeId: matter.id,
      name: 'Transformation',
      description:
        "Affinité avec l'aspect de la matière. Capacité à le déformer, le modeler, le tordre.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Transmutation' },
    create: {
      typeId: matter.id,
      name: 'Transmutation',
      description:
        "Affinité avec la nature de la matière. Capacité à l'en faire en changer.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Golem' },
    create: {
      typeId: matter.id,
      name: 'Golem',
      description:
        'Affinité avec les matières subtiles, orichalque et roselle. Capacité à les sculpter, les entendre et leur commander.',
    },
    update: {},
  });

  const time = await prisma.potentialType.upsert({
    where: { name: 'Le Temps' },
    create: { name: 'Le Temps', categoryId: law.id },
    update: {},
  });

  await prisma.potential.upsert({
    where: { name: 'Chronos' },
    create: {
      typeId: time.id,
      name: 'Chronos',
      description:
        "Affinité avec le temps présent, qui s'écoule. Aptitude à le tordre, l'étirer ou le presser.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Aiôn' },
    create: {
      typeId: time.id,
      name: 'Aiôn',
      description:
        "Affinité avec le temps passé ou à venir. Aptitude à s'y projeter, remonter ou descendre le Grand Fleuve et ses méandres.",
    },
    update: {},
  });
  await prisma.potential.upsert({
    where: { name: 'Oracle' },
    create: {
      typeId: time.id,
      name: 'Oracle',
      description:
        "Affinité avec l'écoulement du temps, passé, présent ou futur. Aptitude à percevoir les à venir, les supposés, à lire ce qui fut, ou ce qui pourrait.",
    },
    update: {},
  });
};

export default seed;
