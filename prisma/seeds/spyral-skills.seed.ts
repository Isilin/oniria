import { PrismaClient, SkillDegree, SkillType } from '@prisma/client';

const seed = async (prisma: PrismaClient) => {
  const fElements = await prisma.skill.upsert({
    where: { name_category: { name: 'Éléments', category: 'Focalisation' } },
    create: {
      name: 'Éléments',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const fConcept = await prisma.skill.upsert({
    where: { name_category: { name: 'Concepts', category: 'Focalisation' } },
    create: {
      name: 'Concepts',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const fLaws = await prisma.skill.upsert({
    where: { name_category: { name: 'Lois', category: 'Focalisation' } },
    create: {
      name: 'Lois',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const perceive = await prisma.skill.upsert({
    where: { name_category: { name: 'Percevoir', category: 'Focalisation' } },
    create: {
      name: 'Percevoir',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [fElements, fConcept, fLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Accepter', category: 'Focalisation' } },
    create: {
      name: 'Accepter',
      description:
        'Le focan s’immunise instinctivement à son propre potentiel. Inconsciemment, il le manipule toujours suffisamment pour ne plus jamais risquer de se blesser avec. C’est pour lui un nouveau sens permanent aussi présent et sûr que les cinq premiers. Il fait désormais part intégrante de lui.',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: perceive },
    },
    update: {},
  });

  const invoke = await prisma.skill.upsert({
    where: { name_category: { name: 'Invoquer', category: 'Focalisation' } },
    create: {
      name: 'Invoquer',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [fElements, fConcept, fLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Suinter', category: 'Focalisation' } },
    create: {
      name: 'Suinter',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: invoke },
    },
    update: {},
  });

  const banish = await prisma.skill.upsert({
    where: { name_category: { name: 'Bannir', category: 'Focalisation' } },
    create: {
      name: 'Bannir',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [fElements, fConcept, fLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Égaliser', category: 'Focalisation' } },
    create: {
      name: 'Égaliser',
      description:
        'Le spyre a appris comment équilibrer son rapport à la réalité qu’il déforme. Il tord ses matrices pour y propager des échos de ses effets passés, parvenant à stocker les Saï et Ensaï qu’il peut faire pour qu’elles s’y annulent. Il n’en retire par là aucun des avantages habituels. S’il accumule plus d’une Ensaï, chacune après la première lui demande de réussir un jet d’entendement pur, au risque de provoquer une réaction en chaîne. Les Saï peuvent être accumulées sans risque.',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: banish },
    },
    update: {},
  });

  const lead = await prisma.skill.upsert({
    where: { name_category: { name: 'Diriger', category: 'Focalisation' } },
    create: {
      name: 'Diriger',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [fElements, fConcept, fLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Pulser', category: 'Focalisation' } },
    create: {
      name: 'Pulser',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: lead },
    },
    update: {},
  });

  const shape = await prisma.skill.upsert({
    where: { name_category: { name: 'Modeler', category: 'Focalisation' } },
    create: {
      name: 'Modeler',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [fElements, fConcept, fLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Structurer', category: 'Focalisation' } },
    create: {
      name: 'Structurer',
      category: 'Focalisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: shape },
    },
    update: {},
  });

  const iElements = await prisma.skill.upsert({
    where: { name_category: { name: 'Éléments', category: 'Incantation' } },
    create: {
      name: 'Éléments',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const iConcept = await prisma.skill.upsert({
    where: { name_category: { name: 'Concepts', category: 'Incantation' } },
    create: {
      name: 'Concepts',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const iLaws = await prisma.skill.upsert({
    where: { name_category: { name: 'Lois', category: 'Incantation' } },
    create: {
      name: 'Lois',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const canalize = await prisma.skill.upsert({
    where: { name_category: { name: 'Canaliser', category: 'Incantation' } },
    create: {
      name: 'Canaliser',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [iElements, iConcept, iLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Enchaîner', category: 'Incantation' } },
    create: {
      name: 'Enchaîner',
      description:
        'Le sorcier devient une véritable batterie à sortilèges. Chaque sortilège lancé diminue la durée d’incantation du suivant d’un tour, cumulativement, tant qu’il les enchaîne l’un après l’autre sans s’interrompre. Il ne peut néanmoins pas finir par les lancer instantanément, toujours au minimum limité à deux actions par sortilège lancé.',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: canalize },
    },
    update: {},
  });

  const summon = await prisma.skill.upsert({
    where: { name_category: { name: 'Invoquer', category: 'Incantation' } },
    create: {
      name: 'Invoquer',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [iElements, iConcept, iLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Attacher', category: 'Incantation' } },
    create: {
      name: 'Attacher',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: summon },
    },
    update: {},
  });

  const iBannish = await prisma.skill.upsert({
    where: { name_category: { name: 'Bannir', category: 'Incantation' } },
    create: {
      name: 'Bannir',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [iElements, iConcept, iLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Charger', category: 'Incantation' } },
    create: {
      name: 'Charger',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: iBannish },
    },
    update: {},
  });

  const iLead = await prisma.skill.upsert({
    where: { name_category: { name: 'Diriger', category: 'Incantation' } },
    create: {
      name: 'Diriger',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [iElements, iConcept, iLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Phaser', category: 'Incantation' } },
    create: {
      name: 'Phaser',
      description:
        'Lorsqu’il fait usage de ses potentiels, le spyre le fait avec une concentration et un abandon tel du reste qu’il passe dans le Miroir, le temps de résoudre son effet. Ce dernier s’applique normalement, et l‘incantation d‘un sortilège ne compte pas comme un temps de phase. Le spyre ne réapparaît qu’en cessant de faire usage de spyrée. Sa perception du plan primaire est faussée par le Miroir, selon les règles habituelles, tant qu’il est hors phase.',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: iLead },
    },
    update: {},
  });

  const iModelize = await prisma.skill.upsert({
    where: { name_category: { name: 'Modeler', category: 'Incantation' } },
    create: {
      name: 'Modeler',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [iElements, iConcept, iLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Tisser', category: 'Incantation' } },
    create: {
      name: 'Tisser',
      category: 'Incantation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: iModelize },
    },
    update: {},
  });

  const rElements = await prisma.skill.upsert({
    where: { name_category: { name: 'Éléments', category: 'Ritualisation' } },
    create: {
      name: 'Éléments',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const rConcept = await prisma.skill.upsert({
    where: { name_category: { name: 'Concepts', category: 'Ritualisation' } },
    create: {
      name: 'Concepts',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const rLaws = await prisma.skill.upsert({
    where: { name_category: { name: 'Lois', category: 'Ritualisation' } },
    create: {
      name: 'Lois',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const need = await prisma.skill.upsert({
    where: { name_category: { name: 'Nécessité', category: 'Ritualisation' } },
    create: {
      name: 'Nécessité',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [rElements, rConcept, rLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Sacrifier', category: 'Ritualisation' } },
    create: {
      name: 'Sacrifier',
      description:
        'Le rituel est une magie du besoin, qui s’affaiblit sans nécessité réelle et concrète. A force, le ritualiste avisé découvre qu’il lui est possible de compenser ce manque de besoin direct et précis par un sacrifice, une oblation aux puissances qu‘il conjure. Quoi qu’il fasse pour marquer ce sacrifice, sa valeur est soit représentée par la valeur qu’il accorde lui à ce qu’il sacrifie, soit celle que le monde y accorde. Il est évident que la seconde sera toujours plus forte que la première dans la plupart des cas... Mais seulement dans la plupart des cas. Pour chaque sacrifice approprié, le ritualiste repousse d’un rang la limite imposée par le maître de jeu aux marges de réussite de tous les principes du rituel.',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: need },
    },
    update: {},
  });

  const destination = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Destination', category: 'Ritualisation' },
    },
    create: {
      name: 'Destination',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [rElements, rConcept, rLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Imprégner', category: 'Ritualisation' } },
    create: {
      name: 'Imprégner',
      description:
        'La plus grande faiblesse du ritualiste réside en son impuissance face à l’inattendu. Sa magie est par essence situationnelle et sans une préparation adéquate et en possession de tous les facteurs liés à l’usage de ce qu’il prépare, il ne peut rien. L’imprégnation a été développée dans l’idée même de compenser cette faille. Grâce à elle, le ritualiste infuse un objet, un lieu ou un être de sa spyrée, lui donnant une forme adéquate pour en faire un piège, une défense ou une arme, accédant ainsi à la capacité de pouvoir s’armer face à l’inconnu.',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: destination },
    },
    update: {},
  });

  const wording = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Formulation', category: 'Ritualisation' },
    },
    create: {
      name: 'Formulation',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [rElements, rConcept, rLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Conditionner', category: 'Ritualisation' },
    },
    create: {
      name: 'Conditionner',
      description:
        'Le ritualiste pouvant conditionner son rituel accède à une foule de possibilités, sachant dans sa formulation de ce dernier comment inclure des commandes de déclenchement, d’arrêt, de direction ou de modulation définies lors de la ritualisation.',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: wording },
    },
    update: {},
  });

  const object = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Objet', category: 'Ritualisation' },
    },
    create: {
      name: 'Objet',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [rElements, rConcept, rLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Unifier', category: 'Ritualisation' },
    },
    create: {
      name: 'Unifier',
      description:
        'Le ritualiste sait désormais s‘entourer efficacement. Il peut s‘adjoindre des officiants qui participeront de façon active au rituel, si tant est qu’ils possèdent également un potentiel de spyrée approprié pour le rituel visé. Pour chaque NmR obtenu par un acolyte, le ritualiste ajoute un point à sa Mr finale.',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: object },
    },
    update: {},
  });

  const nuance = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Subtilité', category: 'Ritualisation' },
    },
    create: {
      name: 'Subtilité',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: [rElements, rConcept, rLaws] },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Enchanter', category: 'Ritualisation' },
    },
    create: {
      name: 'Enchanter',
      description:
        'Parmi les applications infinies du rituel existe un art prisé et rare, qui est considéré par nombre de ritualistes comme l’apogée de leur discipline: l’enchantement. Bien au-delà des possibilités accordées par l’imprégnation, un rituel d’enchantement infuse un objet de magie. L’enchanteur, à travers sa formulation, va investir un peu de son expérience, un fragment de son savoir possible, pour fixer dans l’objet choisi un potentiel pouvoir et lui donner une forme. Plus l’enchantement est fort, plus la formulation appropriée, plus le réceptacle choisi avec soin et plus la dépense d’expérience pourra être grande, permettant ainsi d’obtenir un pouvoir plus vaste, plus intense ou plus long. Résumer davantage les mille et une variations et conditions possibles à cet art en quelques lignes serait impossible, aussi il revient au maître de jeu et au joueur de préparer tels rituels avec grand soin.',
      category: 'Ritualisation',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: nuance },
    },
    update: {},
  });

  const mElements = await prisma.skill.upsert({
    where: { name_category: { name: 'Éléments', category: 'Manifestations' } },
    create: {
      name: 'Éléments',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const chimera = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Chimères', category: 'Manifestations' },
    },
    create: {
      name: 'Chimères',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: mElements },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Chimère portée', category: 'Manifestations' },
    },
    create: {
      name: 'Chimère portée',
      description:
        'Chimériser son potentiel consiste à l’extraire de soi vers le monde. Le spyre n’altère plus le réel via sa pensée, il donne à celle-ci une forme matérielle pour ce faire. Porter sa chimère consiste à lui donner une forme d’arme, d’armure ou tout autre objet en rapport avec le potentiel chimérisé. Les caractères et qualité de l’objet ainsi manifesté dépendent évidemment du niveau du potentiel, et de sa nature.',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: chimera },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Chimère incarnée', category: 'Manifestations' },
    },
    create: {
      name: 'Chimère incarnée',
      description:
        'Plutôt que de manifester sa chimère sous une forme que le spyre puisse utiliser, il lui donne cette fois une apparence autonome, celle d’une entité ou d’un être à part entière. De cette façon, la chimère est libre d’agir, d’attaquer ou de défendre seule, utilisant pour ce faire les caractères d’esprit du spyre.',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: chimera },
    },
    update: {},
  });

  const mConcept = await prisma.skill.upsert({
    where: { name_category: { name: 'Concepts', category: 'Manifestations' } },
    create: {
      name: 'Concepts',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const pact = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Pactes', category: 'Manifestations' },
    },
    create: {
      name: 'Pactes',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: mConcept },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: "Pacte d'absorption", category: 'Manifestations' },
    },
    create: {
      name: "Pacte d'absorption",
      description:
        'Si l’on considère les spyréales de façon un peu simpliste, ces dernières peuvent être vues comme des potentiels libres et individuels, des esprits primordiaux nés des échos de la magie sur le monde. Les spyres l’ont bien compris, et certains ont développé des moyens d’user de ces dernières pour faire croître leur pouvoir propre. Le pacte d’absorption permet au spyre qui le manifeste par le biais d’un rituel de forcer une spyréale à quitter sa forme matérielle pour se nicher en lui. Il en tire, selon la puissance de la spyréale absorbée de la sorte, un potentiel qu’il ignorait, un accroissement du sien propre ou un gain relatif d’esprit, cette dernière opportunité comportant néanmoins quelques risques.',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: pact },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: {
        name: 'Pacte de domination',
        category: 'Manifestations',
      },
    },
    create: {
      name: 'Pacte de domination',
      description:
        'Au lieu de traiter une spyréale qu’il a pactisé comme une batterie à magie, certains spyres choisissent d’en faire des extensions d’eux-mêmes. Ils projettent à travers un rituel approprié une part de leur conscience à travers la créature, la possédant de la sorte et pouvant ainsi en user à leur guise, uniquement limités en cela par l’écart d’esprit et de potentiels existant entre eux et les spyréales qu’ils dominent.',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: pact },
    },
    update: {},
  });

  const mLaws = await prisma.skill.upsert({
    where: { name_category: { name: 'Lois', category: 'Manifestations' } },
    create: {
      name: 'Lois',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const nexus = await prisma.skill.upsert({
    where: {
      name_category: { name: 'Nexus', category: 'Manifestations' },
    },
    create: {
      name: 'Nexus',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: mLaws },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Porte du Nexus', category: 'Manifestations' },
    },
    create: {
      name: 'Porte du Nexus',
      description:
        'Si l’affrontement de plusieurs spyres donne une matrice conflictuelle, chacun luttant pour imposer sa version de la réalité dans la zone, dans laquelle les autres vivent généralement des instants difficiles, lorsqu’ils décident d’œuvrer ensemble pour la changer les choses ne se passent généralement pas mieux. Malgré les efforts investis dans une altération commune du réel, chacun voit les choses d’une façon trop intimement personnelle pour ne pas engendrer l’apparition de conflits, et ils finissent tout autant par lutter les uns contre les autres. Pourtant, certains sont parvenus à trouver le moyen pour agir conjointement à une magie commune. Ceci ne peut se faire sans que l’un d’eux soit élu par les autres pour devenir le vecteur de leurs pouvoirs respectifs. Ils forment un Nexus, et celui qu’ils ont élu peut, une fois cette maîtrise acquise, s’abandonner aux esprits qui se tendent vers lui pour rassembler leurs magies en un seul et unique flux. Il perd tout contrôle des effets du pouvoir qu’il canalise, son esprit totalement absorbé par cet effort. Chaque petite fracture d’équilibre reçue par l’un des participants est partagée, et interrompre son action tant qu‘il demeure des participants connectés au Nexus lui infligera une catastrophe. Il ne saurait plus être empêché de poursuivre son œuvre tant qu’il ne parvient pas à cesser de lui-même, son équilibre fut-il rompu. Ceci ne l’empêchant pas de recevoir des dérangements, c’est là une activité particulièrement agressive pour la psyché de n’importe qui.',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: nexus },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: {
      name_category: { name: 'Clé du Nexus', category: 'Manifestations' },
    },
    create: {
      name: 'Clé du Nexus',
      description:
        'Grâce à cette maîtrise, le spyre sait et peut se connecter à un Nexus, tant que l’un des autres participants peut et surtout accepte de lui ouvrir ses Portes. Il ne peut néanmoins plus accéder à ses maîtrises spyrales que si le pilier les possède également.',
      category: 'Manifestations',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: nexus },
    },
    update: {},
  });

  const integrity = await prisma.skill.upsert({
    where: { name_category: { name: '-', category: 'Intégrité' } },
    create: {
      name: '-',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.BASE,
    },
    update: {},
  });

  const inElements = await prisma.skill.upsert({
    where: { name_category: { name: 'Éléments', category: 'Intégrité' } },
    create: {
      name: 'Éléments',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: integrity },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Choquer', category: 'Intégrité' } },
    create: {
      name: 'Choquer',
      description:
        'L’intègre est suffisamment assuré de ce qui le constitue pour troubler le plus déterminé des spyres qui tenterait de le contredire là-dessus. Si son intégrité fonctionne, le spyre qui tentait de l’affecter s’inflige une case d’équilibre s’il ne le faisait pas. Si c’était déjà le cas, on augmente sa gravité d’un cran.',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: inElements },
    },
    update: {},
  });

  const inConcepts = await prisma.skill.upsert({
    where: { name_category: { name: 'Concepts', category: 'Intégrité' } },
    create: {
      name: 'Concepts',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: integrity },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Percer', category: 'Intégrité' } },
    create: {
      name: 'Percer',
      description:
        'L’intègre ne croit plus en sa seule stabilité, mais en celle de ce qui l’entoure directement. Si son intégrité fonctionne face à un effet de zone ou d’aura qui l’affecte, c’est toute la zone ou l’aura qui saute.',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: inConcepts },
    },
    update: {},
  });

  const inLaws = await prisma.skill.upsert({
    where: { name_category: { name: 'Lois', category: 'Intégrité' } },
    create: {
      name: 'Lois',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: integrity },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Permettre', category: 'Intégrité' } },
    create: {
      name: 'Permettre',
      description:
        'À force de s’immuniser aux effets qui le ciblent, le spyre apprend peu à peu à mieux contrôler cette immunité. Il peut désormais choisir de se laisser affecter par certains effets sans y appliquer son intégrité.',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: inLaws },
    },
    update: {},
  });

  const inMysteries = await prisma.skill.upsert({
    where: { name_category: { name: 'Mystères', category: 'Intégrité' } },
    create: {
      name: 'Mystères',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.PRINCIPLE,
      prerequisites: { connect: integrity },
    },
    update: {},
  });

  await prisma.skill.upsert({
    where: { name_category: { name: 'Simuler', category: 'Intégrité' } },
    create: {
      name: 'Simuler',
      description:
        'L’intègre connaît et comprend les mécanismes de la spyrée aussi bien qu’un spyre, mais de façon si extérieure qu’il ne saurait pour autant développer de potentiel accidentellement. Néanmoins, en cas de réussite critique de son intégrité face à un effet adverse,  sa résistance est à présent si lisse et si naturelle qu’elle inflige aussitôt au spyre la catastrophe ‘Obstination’.',
      category: 'Intégrité',
      type: SkillType.SPYRAL,
      degree: SkillDegree.MASTERY,
      prerequisites: { connect: inMysteries },
    },
    update: {},
  });
};

export default seed;
