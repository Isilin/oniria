import type { FullSheet } from '@/lib/db/sheet';
import { type XpKind, sheetElements } from '@/lib/rules/xp';

/**
 * Fiches fictives au format `FullSheet`, pour les tests du PDF et les
 * échantillons (scripts/pdf-samples.mjs). Aucune ne vient de la base.
 */

let counter = 0;
const id = (prefix: string) => `${prefix}-${++counter}`;
const at = (day: number, hour = 20) =>
  new Date(Date.UTC(2026, 8, day, hour, 30));

type Sheet = FullSheet;
type SkillDegree = Sheet['skills'][number]['skill']['degree'];
type SkillType = Sheet['skills'][number]['skill']['type'];

const MJ = { id: 'user-mj', name: 'Noème (MJ)', image: null };

const skill = (
  type: SkillType,
  category: string,
  name: string,
  degree: SkillDegree,
  options: { prerequisiteId?: string; suffixe?: string; skillId?: string } = {},
) => {
  const skillId = options.skillId ?? id('skill');
  return {
    id: id('owned'),
    createdAt: at(1),
    lostAt: null,
    lostXp: null,
    sheetId: '',
    suffixe: options.suffixe ?? null,
    prerequisiteId: options.prerequisiteId ?? null,
    skillId,
    skill: {
      id: skillId,
      name,
      description: null,
      type,
      category,
      degree,
    },
  };
};

const property = (name: string) => ({
  id: id('prop'),
  name,
  description: null,
});

const equipment = {
  lostAt: null,
  prerequisite_stat: null,
  prerequisite_value: null,
  properties: [] as ReturnType<typeof property>[],
  quality: null,
  equipped: true,
  bulk: null,
  solidity: null,
};

const entry = (
  kind: XpKind,
  label: string,
  amounts: { feel?: number; learn?: number; live?: number; offered?: number },
  extra: { target?: string; scope?: string; batch?: string; day?: number } = {},
) => ({
  id: id('xp'),
  seq: ++counter,
  createdAt: at(extra.day ?? 1),
  sheetId: '',
  authorId: MJ.id,
  author: MJ,
  kind,
  feel: amounts.feel ?? 0,
  learn: amounts.learn ?? 0,
  live: amounts.live ?? 0,
  offered: amounts.offered ?? 0,
  target: extra.target ?? null,
  scope: extra.scope ?? null,
  label,
  batch: extra.batch ?? null,
});

const base = (patch: Partial<Sheet>): Sheet =>
  ({
    id: id('sheet'),
    userId: 'user-1',
    user: { id: 'user-1', name: 'Joueuse de test', image: null },
    teams: [],
    createdAt: at(1),
    updatedAt: at(1),
    name: 'Sans nom',
    avatar: null,
    age: null,
    current_mai: null,
    aspect: null,
    become: null,
    tint: null,
    strength: 25,
    agility: 25,
    vivacity: 25,
    vigour: 25,
    thinking: 25,
    perception: 25,
    concentration: 25,
    understanding: 25,
    charisma: 25,
    empathy: 25,
    ego: 25,
    will: 25,
    current_health: null,
    current_stability: null,
    current_radiance: null,
    lostPoints: null,
    xpEntries: [],
    unlocked: [
      'body',
      'spirit',
      'soul',
      'general',
      'spyral',
      'martial',
      'corpus',
      'spyree',
    ],
    corpus: [],
    spyree: [],
    amee: [],
    traits: [],
    skills: [],
    spells: [],
    golems: [],
    armors: [],
    meleeWeapons: [],
    rangeWeapons: [],
    items: [],
    notes: '',
    ...patch,
  }) as Sheet;

/**
 * Valide la fiche comme le ferait le serveur : l'XP de création, puis une
 * dépense par élément (payée en Vivre), et ce qu'il reste à dépenser.
 */
const validated = (
  sheet: Sheet,
  left: { feel?: number; learn?: number; live?: number },
) => {
  const elements = sheetElements(sheet).filter((e) => e.cost > 0);
  const total = elements.reduce((t, e) => t + e.cost, 0);
  const batch = `validation:${sheet.id}`;
  return {
    ...sheet,
    unlocked: [],
    xpEntries: [
      entry('GAIN', 'Création', { live: 700 }, { day: 2 }),
      entry(
        'GAIN',
        'Sessions 1 à 6',
        { live: Math.max(0, total - 700) + (left.live ?? 0) },
        { day: 3 },
      ),
      ...elements.map((e) =>
        entry(
          'SPEND',
          e.label,
          { live: e.cost },
          {
            target: e.target,
            scope: e.scope,
            batch,
            day: 4,
          },
        ),
      ),
      entry(
        'GAIN',
        'Session 7',
        { feel: left.feel ?? 0, learn: left.learn ?? 0 },
        {
          day: 18,
        },
      ),
    ],
  } as Sheet;
};

const LYSE_NOTES = `# Carnet de voyage

Arrivée sur la **Lune d'Ambre** au troisième jour. Les marchands parlent
une langue *chantée* ; <u>ne jamais</u> accepter le thé de la guilde.

## Contacts

- Maître Oriel, cartographe : doit une faveur
- [x] Retrouver la boussole de Corwin
- [ ] Payer la dette au passeur

> « La lune ne ment jamais, elle se tait. »

| Lieu | Distance | Danger |
|:--|--:|:--:|
| Port des Brumes | 3 jours | faible |
| Col de Verre | 9 jours | ~~élevé~~ moyen |

---

Croquis de la carte :

![Carte du Col](https://exemple.org/carte.png)

Prochaine étape : \`Porte d'Onyx\`, voir https://oniria.example/porte-onyx.
`;

/** Lyse : fiche validée, complète, avec de l'XP à dépenser. */
export const lyse = (): Sheet => {
  const sheetId = id('sheet');
  const graphisme = skill('GENERAL', 'Art', 'Graphisme', 'BASE');
  const peinture = skill('GENERAL', 'Art', 'Peinture', 'PRINCIPLE', {
    prerequisiteId: graphisme.skillId,
  });
  const oeuvre = skill('GENERAL', 'Art', 'Œuvre [Peinture]', 'MASTERY', {
    prerequisiteId: peinture.skillId,
    suffixe: 'les lunes jumelles',
  });
  const lutte = skill('MARTIAL', 'Lutte', '-', 'BASE');
  const esquive = skill('MARTIAL', 'Lutte', 'Esquive', 'TECHNIQUE', {
    prerequisiteId: lutte.skillId,
  });
  const sheet = base({
    id: sheetId,
    name: 'Lyse (test)',
    avatar: 'https://exemple.org/lyse.png',
    age: 31,
    aspect: 'Inspirée : la Lune',
    become: '38',
    tint: 'ambre',
    teams: [{ id: 'team-1', name: 'Table de test' }],
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
    current_health: 2,
    current_stability: 3,
    current_mai: 4,
    corpus: [
      {
        id: id('corpus'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        lostXp: null,
        typeId: 'ct-1',
        type: { id: 'ct-1', name: 'Origine' },
        name: "l'Abîme",
        description: 'Costume de scène, toujours.',
        stat: 'charisma',
        bonus: 2,
      },
      {
        id: id('corpus'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        lostXp: null,
        typeId: 'ct-2',
        type: { id: 'ct-2', name: 'Apparence' },
        name: 'Cheveux de cendre',
        description: null,
        stat: 'health',
        bonus: 1,
      },
    ],
    spyree: [
      {
        id: id('spyree'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        lostXp: null,
        level: 2,
        potentialId: 'pot-1',
        potential: {
          id: 'pot-1',
          typeId: 'pt-1',
          name: 'Flamme',
          description: 'Ne figure pas dans le PDF.',
          type: {
            id: 'pt-1',
            name: 'Le Feu',
            categoryId: 'pc-1',
            category: { id: 'pc-1', name: 'Élément' },
          },
        },
      },
    ],
    amee: [
      {
        id: id('amee'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Le chant des marées',
        description: 'Se souvient de chaque port.',
      },
    ],
    traits: [
      {
        id: id('trait'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Curieuse',
        description: 'Ouvre toutes les portes, même celles qui mordent.',
        balance: 2,
        inborn: true,
      },
      {
        id: id('trait'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Distraite',
        description: null,
        balance: -2,
        inborn: true,
      },
      {
        id: id('trait'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Faveur de la Lune',
        description: 'Une nuit par cycle, la lune répond.',
        balance: null,
        inborn: false,
      },
    ],
    skills: [graphisme, peinture, oeuvre, lutte, esquive].map((s) => ({
      ...s,
      sheetId,
    })),
    spells: [
      {
        id: id('spell'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Voile d’argent',
        incantation: 'Lunae velum',
        targeting: 'Soi',
        duration: 'Une scène',
        effect: 'Rend floue la silhouette sous la lumière lunaire.',
      },
    ],
    meleeWeapons: [
      {
        ...equipment,
        id: id('melee'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Dague de verre',
        damage: 3,
        extend: 1,
        bulk: 5,
        solidity: 4,
        prerequisite_stat: 'strength',
        prerequisite_value: 40,
        properties: [property('Fragile'), property('Discrète')],
        quality: 2,
      },
    ],
    rangeWeapons: [
      {
        ...equipment,
        id: id('range'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Arbalète de poing',
        damage: 4,
        penetration_damage: 2,
        velocity: 3,
        rate: 1,
        reload_rate: 2,
        range: null,
        low_range: 10,
        medium_range: 25,
        long_range: 50,
        bulk: 10,
        solidity: 5,
        quality: 1,
        properties: [property('Recharge lente')],
      },
    ],
    armors: [
      {
        ...equipment,
        id: id('armor'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Manteau de cuir',
        protection: 3,
        current_protection: 2,
        index: 1,
        type: 'LOW',
        bulk: 10,
        solidity: 3,
        quality: 1,
      },
    ],
    items: [
      {
        id: id('item'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Boussole de Corwin',
        description: 'Indique toujours la lune la plus proche.',
        quantity: 1,
      },
      {
        id: id('item'),
        createdAt: at(1),
        sheetId,
        lostAt: null,
        name: 'Craies de couleur',
        description: null,
        quantity: 12,
      },
    ],
    notes: LYSE_NOTES,
  });
  // Ce que le MJ a rayé : 5 points de Force (achetés après la validation),
  // la Technique « Esquive » (payée à la validation), une faveur perdue et
  // un objet. L'XP payée pour eux est perdue ; la fiche reste sans écart.
  const struck = at(20);
  const done = validated(sheet, { feel: 15, learn: 20, live: 35 });
  const char = { target: 'char:strength', scope: 'body' };
  const dodge = { target: `skill:${esquive.id}`, scope: 'martial' };
  return {
    ...done,
    lostPoints: { strength: 5 },
    traits: done.traits.map((t) => (t.inborn ? t : { ...t, lostAt: struck })),
    skills: done.skills.map((k) =>
      k.id === esquive.id ? { ...k, lostAt: struck, lostXp: 10 } : k,
    ),
    items: done.items.map((i, n) => (n === 1 ? { ...i, lostAt: struck } : i)),
    xpEntries: [
      ...done.xpEntries,
      entry('GAIN', 'Session 8', { live: 5 }, { day: 19 }),
      entry('SPEND', 'Force 20 → 25', { live: 5 }, { ...char, day: 19 }),
      entry(
        'LOSS',
        'Force 25 → 20 (points rayés)',
        { live: 5 },
        { ...char, day: 20 },
      ),
      entry(
        'LOSS',
        'Compétence : Esquive (rayée)',
        { live: 10 },
        { ...dodge, day: 20 },
      ),
    ],
  } as Sheet;
};

/** Le Colosse : PNJ encore en création, sans rien d'autre. */
export const colosse = (): Sheet =>
  base({
    name: 'Le Colosse',
    user: { id: 'user-mj', name: 'MJ de test', image: null },
    strength: 75,
    vigour: 70,
    xpEntries: [entry('GAIN', 'Création', { live: 700 }, { day: 5 })],
  });

/** Une fiche vide, telle qu'à sa création. */
export const empty = (): Sheet => base({ name: null });

/** Corwin : transcendé, au nom long, avec un émoji. */
export const corwin = (): Sheet => {
  const sheet = base({
    name: 'Corwin 🌙 de la Porte d’Onyx et des Sept Brumes',
    user: { id: 'user-2', name: 'Joueur de test', image: null },
    age: 54,
    aspect: 'Errant',
    become: '120',
    tint: 'azur',
    teams: [{ id: 'team-1', name: 'Table de test' }],
    strength: 60,
    agility: 55,
    vigour: 60,
    will: 70,
    current_radiance: 0,
    notes: 'Une seule ligne, sans titre.',
  });
  return {
    ...validated(sheet, { live: 10 }),
    // Écart volontaire : une dépense manque au compte.
    xpEntries: validated(sheet, { live: 10 }).xpEntries.slice(0, -2),
  } as Sheet;
};

/** Une fiche chargée : longues listes, longues notes, long journal. */
export const heavy = (): Sheet => {
  const sheet = lyse();
  const many = <T>(n: number, make: (i: number) => T) =>
    Array.from({ length: n }, (_, i) => make(i));
  const longNotes = many(
    40,
    (i) =>
      `## Session ${i + 1}\n\n${'Le vent tourne sur la lune d’ambre, et les cartes changent de nom. '.repeat(6)}\n\n- un indice\n- une dette`,
  ).join('\n\n');
  return {
    ...sheet,
    name: 'Grande fiche (test)',
    avatar: null,
    traits: [
      ...sheet.traits,
      ...many(14, (i) => ({
        ...sheet.traits[2],
        lostAt: null,
        id: id('trait'),
        name: `Séquelle ${i + 1}`,
        description:
          'Une cicatrice qui raconte une histoire, longue et sinueuse comme un fleuve sous la lune.',
      })),
    ],
    items: many(30, (i) => ({
      ...sheet.items[0],
      id: id('item'),
      name: `Objet ${i + 1}`,
      quantity: i + 1,
    })),
    rangeWeapons: many(5, () => ({
      ...sheet.rangeWeapons[0],
      id: id('range'),
    })),
    xpEntries: [
      ...sheet.xpEntries,
      ...many(60, (i) =>
        entry(
          'GAIN',
          `Session ${i + 8}`,
          { feel: 5, learn: 5, live: 5 },
          {
            day: 19 + (i % 10),
          },
        ),
      ),
    ],
    notes: longNotes,
  } as Sheet;
};

/** La table de test : Lyse, Corwin, le Colosse. */
export const team = () => ({
  name: 'Table de test',
  members: [corwin(), colosse(), lyse()].sort((a, b) =>
    (a.name ?? '').localeCompare(b.name ?? ''),
  ),
});
