import { PrismaClient } from '@prisma/client';
import { TEST_ACCOUNTS } from './test-login';
import { validateSheet } from './xp';

/**
 * Données de test (personnages fictifs) pour l'aperçu. Les éléments des
 * catalogues sont retrouvés par leur nom ; s'ils manquent (catalogues non
 * remplis), ils sont simplement ignorés.
 *
 * Idempotent : un compte de test qui a déjà des fiches n'en reçoit pas
 * d'autres.
 */

type Db = PrismaClient;

interface DemoGrant {
  label: string;
  feel?: number;
  learn?: number;
  live?: number;
}

interface DemoCharacter {
  name: string;
  age?: number;
  aspect?: string;
  become?: string;
  stats: Record<string, number>;
  /** XP attribuée par le MJ avant la validation de la fiche. */
  xp: DemoGrant[];
  /** Validée (l'XP est dépensée) ou encore en création. */
  validated: boolean;
  /** XP attribuée après la validation, à dépenser. */
  xpAfter?: DemoGrant[];
  corpus: {
    type: string;
    name: string;
    stat?: string;
    bonus?: number;
    description?: string;
  }[];
  spyree: { potential: string; level: number }[];
  amee: string[];
  traits: { name: string; balance?: number; inborn: boolean }[];
  /** [catégorie, nom] dans l'ordre d'acquisition (prérequis d'abord). */
  skills: [string, string][];
  meleeWeapons: Record<string, unknown>[];
  armors: Record<string, unknown>[];
  items: { name: string; quantity?: number; description?: string }[];
  spells?: Record<string, unknown>[];
  notes?: string;
}

const LYSE: DemoCharacter = {
  name: 'Lyse (test)',
  age: 31,
  aspect: 'Inspirée : la Lune',
  become: '38',
  stats: {
    strength: 20,
    agility: 25,
    vivacity: 15,
    vigour: 30,
    thinking: 50,
    perception: 45,
    concentration: 50,
    understanding: 40,
    charisma: 75,
    empathy: 50,
    ego: 50,
    will: 50,
  },
  xp: [
    { label: 'Création', live: 700 },
    { label: 'Sessions 1 à 6', feel: 165, learn: 200, live: 215 },
  ],
  validated: true,
  xpAfter: [{ label: 'Session 7', feel: 15, learn: 20 }],
  corpus: [
    { type: 'Origine', name: "l'Abîme", description: 'Costume' },
    { type: 'Adaptation', name: "l'Astral", stat: 'charisma', bonus: 1 },
    { type: 'Sensibilité', name: "l'Astral", stat: 'empathy', bonus: 1 },
  ],
  spyree: [
    { potential: 'Correspondance', level: 2 },
    { potential: 'Golem', level: 2 },
    { potential: 'Pardon', level: 1 },
  ],
  amee: ["Lumière : l'Espoir"],
  traits: [
    { name: 'Méfiante', balance: -1, inborn: true },
    { name: 'Recherchée par une guilde', balance: -2, inborn: true },
    { name: 'Affinité matière subtile', balance: 1, inborn: true },
    { name: 'Fidèle de la Lune', balance: 2, inborn: true },
    { name: 'Séquelle du Dédale : claustrophobe', inborn: false },
  ],
  skills: [
    ['Érudition', '-'],
    ['Érudition', 'Lois'],
    ['Éloquence', '-'],
    ['Éloquence', 'Persuasion'],
    ['Ritualisation', 'Lois'],
    ['Ritualisation', 'Destination'],
    ['Ritualisation', 'Imprégner'],
  ],
  meleeWeapons: [
    { name: 'Stylet', damage: 1, solidity: 10, quality: 0 },
    { name: 'Bâton du Reflet', damage: 1, solidity: 20, quality: 3 },
  ],
  armors: [
    {
      name: 'Armure de cuir bouilli',
      protection: 9,
      index: 1,
      bulk: 10,
      solidity: 20,
      prerequisite_stat: 'vigour',
      prerequisite_value: 10,
      quality: 1,
    },
  ],
  items: [
    { name: 'Besace' },
    { name: 'Fiole de soins', quantity: 2 },
    { name: 'Nécessaire de premiers soins' },
  ],
  notes: '# Lyse\n\nPersonnage **fictif** créé pour tester l’aperçu.',
};

const CORWIN: DemoCharacter = {
  name: 'Corwin (test)',
  age: 27,
  aspect: 'Pâle',
  become: '12',
  stats: {
    strength: 75,
    agility: 65,
    vivacity: 40,
    vigour: 50,
    thinking: 25,
    perception: 30,
    concentration: 60,
    understanding: 25,
    charisma: 50,
    empathy: 50,
    ego: 50,
    will: 50,
  },
  xp: [
    { label: 'Création', live: 700 },
    { label: 'Sessions 1 à 6', feel: 120, learn: 150, live: 240 },
  ],
  validated: true,
  xpAfter: [{ label: 'Session 7', feel: 30, learn: 10, live: 10 }],
  corpus: [
    { type: 'Origine', name: 'Hybride', description: 'Humanité' },
    { type: 'Stature', name: 'Guerrière', stat: 'strength', bonus: 1 },
    { type: 'Espérance', name: 'Gladiateur', stat: 'health', bonus: 1 },
    { type: 'Immunité', name: 'Nécrose', stat: 'will', bonus: 1 },
  ],
  spyree: [],
  amee: ['La Rage rêve'],
  traits: [
    { name: 'Hanté par les abysses', balance: -3, inborn: true },
    { name: 'Sanguinaire', balance: -1, inborn: true },
    { name: 'Résistance naturelle', balance: 2, inborn: true },
    { name: 'Hache nordique de famille', balance: 2, inborn: true },
    { name: 'Héros de Vaille', inborn: false },
  ],
  skills: [
    ['Athlétisme', '-'],
    ['Athlétisme', 'Course'],
    ['Lutte', '-'],
    ['Lutte', 'Esquive'],
    ['Lutte', 'Parade'],
    ['Ambidextrie', '-'],
    ['Ambidextrie', 'Arme blanche'],
  ],
  meleeWeapons: [
    {
      name: "Hache d'armes nordique",
      damage: 8,
      extend: 1,
      solidity: 50,
      prerequisite_stat: 'strength',
      prerequisite_value: 40,
      quality: 2,
    },
    {
      name: 'Écu',
      damage: 3,
      extend: 0,
      bulk: 5,
      solidity: 55,
      prerequisite_stat: 'strength',
      prerequisite_value: 40,
      quality: 2,
    },
  ],
  armors: [
    {
      name: 'Brigandine',
      protection: 18,
      current_protection: 15,
      index: 2,
      bulk: 25,
      solidity: 30,
      prerequisite_stat: 'vigour',
      prerequisite_value: 30,
      quality: 2,
    },
  ],
  items: [
    { name: 'Rouleau de corde' },
    { name: 'Provisions (jours)', quantity: 4 },
    { name: 'Grappin' },
  ],
};

const COLOSSE: DemoCharacter = {
  name: 'Le Colosse (PNJ de test)',
  stats: {
    strength: 90,
    agility: 40,
    vivacity: 35,
    vigour: 80,
    thinking: 20,
    perception: 35,
    concentration: 30,
    understanding: 20,
    charisma: 40,
    empathy: 15,
    ego: 45,
    will: 70,
  },
  // PNJ : resté en création, sans XP (le dépassement s'affiche).
  xp: [],
  validated: false,
  corpus: [{ type: 'Stature', name: 'Gigantesque', stat: 'vigour', bonus: 1 }],
  spyree: [{ potential: 'Roche', level: 3 }],
  amee: [],
  traits: [],
  skills: [
    ['Lutte', '-'],
    ['Lutte', 'Poings'],
  ],
  meleeWeapons: [{ name: 'Poings de pierre', damage: 6, solidity: 80 }],
  armors: [],
  items: [],
};

const DEMO: Record<string, DemoCharacter[]> = {
  joueuse: [LYSE],
  joueur: [CORWIN],
  mj: [COLOSSE],
};

const createCharacter = async (db: Db, userId: string, c: DemoCharacter) => {
  const corpusTypes = await db.corpusType.findMany();
  const typeId = (name: string) => corpusTypes.find((t) => t.name === name)?.id;

  const potentials = await db.potential.findMany({
    where: { name: { in: c.spyree.map((s) => s.potential) } },
  });

  const sheet = await db.sheet.create({
    data: {
      userId,
      name: c.name,
      age: c.age,
      aspect: c.aspect,
      become: c.become,
      ...c.stats,
      notes: c.notes ?? '',
      corpus: {
        create: c.corpus
          .filter((e) => typeId(e.type))
          .map(({ type, ...e }) => ({ ...e, typeId: typeId(type) })),
      },
      spyree: {
        create: c.spyree
          .map((s) => ({
            level: s.level,
            potentialId: potentials.find((p) => p.name === s.potential)?.id,
          }))
          .filter((s) => s.potentialId),
      },
      amee: { create: c.amee.map((name) => ({ name })) },
      traits: { create: c.traits },
      meleeWeapons: { create: c.meleeWeapons },
      armors: { create: c.armors },
      items: { create: c.items },
      spells: { create: c.spells ?? [] },
    },
  });

  // Compétences dans l'ordre : chacune retient le prérequis déjà acquis.
  const owned = new Set<string>();
  for (const [category, name] of c.skills) {
    const skill = await db.skill.findUnique({
      where: { name_category: { name, category } },
      include: { prerequisites: { select: { id: true } } },
    });
    if (!skill) continue;
    const prerequisite = skill.prerequisites.find((p) => owned.has(p.id));
    if (skill.prerequisites.length && !prerequisite) continue;
    await db.sheetSkill.create({
      data: {
        sheetId: sheet.id,
        skillId: skill.id,
        prerequisiteId: prerequisite?.id ?? null,
      },
    });
    owned.add(skill.id);
  }

  // Expérience : attribuée par le MJ, puis dépensée à la validation.
  const grant = (grants: DemoGrant[]) =>
    db.xpEntry.createMany({
      data: grants.map(({ label, ...amounts }) => ({
        sheetId: sheet.id,
        authorId: 'test-user-mj',
        kind: 'GAIN' as const,
        label,
        ...amounts,
      })),
    });
  await grant(c.xp);
  if (c.validated) {
    await db.$transaction((tx) =>
      validateSheet(tx, sheet.id, { id: userId, role: 'USER' }),
    );
    await grant(c.xpAfter ?? []);
  }

  return sheet;
};

/** Crée les comptes de test, leurs personnages et une table de test. */
export const ensureTestData = async (db: Db) => {
  const created: string[] = [];

  for (const { key, ...user } of TEST_ACCOUNTS) {
    await db.user.upsert({
      where: { id: user.id },
      create: user,
      update: { name: user.name, role: user.role },
    });
    const count = await db.sheet.count({ where: { userId: user.id } });
    if (count > 0) continue;
    for (const character of DEMO[key] ?? []) {
      await createCharacter(db, user.id, character);
      created.push(character.name);
    }
  }

  const players = await db.sheet.findMany({
    where: { userId: { in: ['test-user-joueuse', 'test-user-joueur'] } },
    select: { id: true },
  });
  await db.team.upsert({
    where: { name: 'Table de test' },
    create: {
      name: 'Table de test',
      members: { connect: players.map((p) => ({ id: p.id })) },
    },
    update: {},
  });

  return created;
};
