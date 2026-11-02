/**
 * Règles d'Oniria telles qu'implémentées dans le tableur de référence
 * « Lunes d'Oniria - Fiches de personnages » (onglet Modèle).
 *
 * Toutes les fonctions ici sont pures : elles servent à la fois côté serveur
 * et côté client, et sont couvertes par des tests (rules.test.ts) qui
 * reprennent des valeurs réelles de fiches du tableur.
 */

export type CharacteristicKey =
  | 'strength'
  | 'agility'
  | 'vivacity'
  | 'vigour'
  | 'thinking'
  | 'perception'
  | 'concentration'
  | 'understanding'
  | 'charisma'
  | 'empathy'
  | 'ego'
  | 'will';

export type GroupKey = 'body' | 'spirit' | 'soul';

export interface Characteristic {
  key: CharacteristicKey;
  label: string;
  /** Abréviation utilisée dans le tableur (« For », « Agi »…). */
  abbr: string;
  group: GroupKey;
  description: string;
}

export const CHARACTERISTICS: Characteristic[] = [
  {
    key: 'strength',
    label: 'Force',
    abbr: 'For',
    group: 'body',
    description:
      'Elle représente, comme son nom l’indique, la force physique du personnage, la puissance cinétique et la pression que celui-ci est apte à mobiliser et à appliquer à son environnement par un contact matériel.',
  },
  {
    key: 'agility',
    label: 'Agilité',
    abbr: 'Agi',
    group: 'body',
    description:
      'Autrement dit la souplesse physique, la précision et l’exactitude des mouvements du personnage, mais aussi sa grâce et son aptitude à mobiliser son corps d’une façon qui lui convient en l’instant.',
  },
  {
    key: 'vivacity',
    label: 'Vivacité',
    abbr: 'Viv',
    group: 'body',
    description:
      'Les réflexes, la rapidité d’exécution et d’action du corps du personnage, la maîtrise instinctive que possède ce dernier et qu’il peut mettre en œuvre sans réellement y penser, la facilité qu’ont ses muscles à s’activer et agir comme d’eux-mêmes.',
  },
  {
    key: 'vigour',
    label: 'Vigueur',
    abbr: 'Vig',
    group: 'body',
    description:
      'L’endurance physique, la solidité du corps, sa capacité à encaisser fatigue, faim et soif, blessures, entre autres maux concrets qu’un personnage peut subir.',
  },
  {
    key: 'thinking',
    label: 'Raisonnement',
    abbr: 'Rai',
    group: 'spirit',
    description:
      'La pertinence de calcul que l’esprit d’un personnage possède, son aptitude à penser juste, à appliquer à ses pensées sa raison de façon efficace.',
  },
  {
    key: 'perception',
    label: 'Perception',
    abbr: 'Per',
    group: 'spirit',
    description:
      'Si l’acuité des sens relève davantage du physique que du mental, c’est pourtant la faculté de l’esprit à se montrer ouvert aux informations qui lui sont relayées comme clairvoyant dans leur tri, qui est là représenté. Pour exemple, de bons yeux ne signifient pas toujours une bonne vue.',
  },
  {
    key: 'concentration',
    label: 'Concentration',
    abbr: 'Con',
    group: 'spirit',
    description:
      'Ou à quel point l’esprit du personnage peut faire, lorsque c’est nécessaire, abstraction de toute distraction intérieure comme extérieure, pour se focaliser sur l’essentiel.',
  },
  {
    key: 'understanding',
    label: 'Entendement',
    abbr: 'Ent',
    group: 'spirit',
    description:
      'La capacité d’un personnage à appréhender le monde qui l’entoure, à intégrer à ce qu’il sait ou croit savoir de nouvelles données, à jongler avec des sujets de réflexion denses et complexes comme à mobiliser des connaissances fraîchement acquises ou depuis longtemps délaissées.',
  },
  {
    key: 'charisma',
    label: 'Charisme',
    abbr: 'Cha',
    group: 'soul',
    description:
      'La présence, l’aura d’un personnage, l’impression qu’il donne et laisse à autrui, la place qu’il occupe en les autres. A noter qu’un charisme faible ne signifie pas nécessairement quelqu’un d’effacé, mais peut tout aussi bien être la marque d’un être beaucoup trop remarqué mais jamais comme il faut, de la même façon qu’un charisme élevé ne veut pas toujours dire un personnage qui rayonne et en impose, mais parfois simplement quelqu’un qui semble toujours à sa place, toujours là où il doit être ou comme il le doit, sans que cela ne paraisse déplacé.',
  },
  {
    key: 'empathy',
    label: 'Empathie',
    abbr: 'Emp',
    group: 'soul',
    description:
      'La perméabilité aux ambiances, aux émotions d’autrui comme aux atmosphères d’alentour. La sensibilité d’un personnage à ce qui l’entoure.',
  },
  {
    key: 'ego',
    label: 'Ego',
    abbr: 'Ego',
    group: 'soul',
    description:
      'Il représente une forme de mesure de l’individualité d’un personnage, de la densité, de la complexité de sa personnalité. Pas forcément sa force de caractère, mais à quel point ce dernier est formé, unique et personnel.',
  },
  {
    key: 'will',
    label: 'Volonté',
    abbr: 'Vol',
    group: 'soul',
    description:
      'La résolution, la détermination, la confiance en soi du personnage. Sa capacité à ne pas faillir à ses propres aspirations ou décisions.',
  },
];

export const CHARACTERISTIC_BY_KEY = Object.fromEntries(
  CHARACTERISTICS.map((c) => [c.key, c]),
) as Record<CharacteristicKey, Characteristic>;

export const GROUPS: { key: GroupKey; label: string }[] = [
  { key: 'body', label: 'Le Corps' },
  { key: 'spirit', label: "L'Esprit" },
  { key: 'soul', label: "L'Âme" },
];

export type FacultyKey =
  | 'directBlow'
  | 'subtleBlow'
  | 'deadlyBlow'
  | 'parade'
  | 'dodge'
  | 'discretion'
  | 'care'
  | 'reflexion'
  | 'improvisation'
  | 'shooting'
  | 'integrity'
  | 'focus'
  | 'spell'
  | 'ritual'
  | 'feeling'
  | 'persuasion'
  | 'charm'
  | 'intimidation'
  | 'fraud'
  | 'belief'
  | 'resolution';

export type FacultyColumn = 'flesh' | 'thought' | 'bond';

export interface Faculty {
  key: FacultyKey;
  label: string;
  column: FacultyColumn;
  /** Caractère majeur : il compte en entier et donne la marge. */
  major: CharacteristicKey;
  /** Caractère mineur : il compte au plus autant que le majeur. */
  minor: CharacteristicKey;
  description?: string;
}

export const FACULTY_COLUMNS: { key: FacultyColumn; label: string }[] = [
  { key: 'flesh', label: 'La Chair' },
  { key: 'thought', label: 'La Pensée' },
  { key: 'bond', label: 'Le Lien' },
];

export const FACULTIES: Faculty[] = [
  {
    key: 'directBlow',
    label: 'Coup Brutal',
    column: 'flesh',
    major: 'strength',
    minor: 'agility',
    description:
      'Du direct du droit au revers de hache en passant par la charge d’épaule ou un bon coup de boule, cette manoeuvre rassemble toutes les attaques visant à briser, broyer, tuer ou faire mal et c’est tout. N’entrent donc dans cette catégorie que les coups épurés de tout objectif autre que ‘taper’.',
  },
  {
    key: 'subtleBlow',
    label: 'Coup Subtil',
    column: 'flesh',
    major: 'vivacity',
    minor: 'agility',
    description:
      'Du croche-pied à la clé de bras, d’un estoc vicieux à l’aine au pouce dans l’œil en passant par la chaîne autour du pied, cette manoeuvre rassemble toutes les attaques ne cherchant pas simplement à blesser l’adversaire, ou au contraire en un point bien précis. Comptant sur la liberté de ses mouvements, le personnage applique à son potentiel de réussite ses malus d’encombrement. Attention, une fois au corps-à-corps, toute action de tir se résout par un coup subtil.',
  },
  {
    key: 'deadlyBlow',
    label: 'Coup Mortel',
    column: 'flesh',
    major: 'vivacity',
    minor: 'concentration',
  },
  {
    key: 'parade',
    label: 'Parade',
    column: 'flesh',
    major: 'agility',
    minor: 'strength',
    description:
      'Blocage au bouclier, à la lame ou à l’avant-bras, mais aussi déviation d’un coup adverse ou libération d’une prise par la force, cette manoeuvre rassemble toutes les actions défensives comptant sur un rapport des forces.',
  },
  {
    key: 'dodge',
    label: 'Esquive',
    column: 'flesh',
    major: 'agility',
    minor: 'vivacity',
    description:
      'Pas chassé sur la droite, un genou à terre au bon moment, le petit bond arrière ou juste un mouvement de tête, cette manoeuvre rassemble toutes les actions défensives qui n’impliquent pas un rapport de forces, mais s’attachent à l’éviter. Comptant sur la liberté de ses mouvements, le personnage applique évidemment à son potentiel de réussite ses malus d’encombrement.',
  },
  {
    key: 'discretion',
    label: 'Discrétion',
    column: 'flesh',
    major: 'agility',
    minor: 'concentration',
  },
  {
    key: 'care',
    label: 'Attention',
    column: 'thought',
    major: 'perception',
    minor: 'empathy',
  },
  {
    key: 'reflexion',
    label: 'Réflexion',
    column: 'thought',
    major: 'understanding',
    minor: 'thinking',
  },
  {
    key: 'improvisation',
    label: 'Improvisation',
    column: 'thought',
    major: 'thinking',
    minor: 'concentration',
  },
  {
    key: 'shooting',
    label: 'Tir',
    column: 'thought',
    major: 'perception',
    minor: 'concentration',
    description:
      'A l’arc, à l’arbalète, à la sarbacane, avec un flingue ou un bon vieux fusil-laser, voire un trébuchet ou une pièce d’artillerie, cette manoeuvre rassemble toutes les actions où le personnage fait usage d’un outil lui permettant d’envoyer des projectiles.',
  },
  {
    key: 'integrity',
    label: 'Intégrité',
    column: 'thought',
    major: 'concentration',
    minor: 'ego',
  },
  {
    key: 'focus',
    label: 'Focus',
    column: 'thought',
    major: 'thinking',
    minor: 'charisma',
  },
  {
    key: 'spell',
    label: 'Sortilège',
    column: 'thought',
    major: 'understanding',
    minor: 'will',
  },
  {
    key: 'ritual',
    label: 'Rituel',
    column: 'thought',
    major: 'concentration',
    minor: 'empathy',
  },
  {
    key: 'feeling',
    label: 'Impression',
    column: 'bond',
    major: 'empathy',
    minor: 'perception',
  },
  {
    key: 'persuasion',
    label: 'Persuasion',
    column: 'bond',
    major: 'charisma',
    minor: 'ego',
  },
  {
    key: 'charm',
    label: 'Séduction',
    column: 'bond',
    major: 'charisma',
    minor: 'empathy',
  },
  {
    key: 'intimidation',
    label: 'Intimidation',
    column: 'bond',
    major: 'charisma',
    minor: 'will',
  },
  {
    key: 'fraud',
    label: 'Tromperie',
    column: 'bond',
    major: 'charisma',
    minor: 'concentration',
  },
  {
    key: 'belief',
    label: 'Conviction',
    column: 'bond',
    major: 'ego',
    minor: 'will',
  },
  {
    key: 'resolution',
    label: 'Résolution',
    column: 'bond',
    major: 'will',
    minor: 'ego',
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Entrées                                   */
/* -------------------------------------------------------------------------- */

export type CharacteristicValues = Record<CharacteristicKey, number>;

export interface CorpusInput {
  /** Caractère concerné (clé, abréviation ou nom) ou « health » pour la santé. */
  stat?: string | null;
  bonus?: number | null;
}

export interface TraitInput {
  inborn: boolean;
  balance?: number | null;
}

export interface EquipmentInput {
  equipped?: boolean | null;
  bulk?: number | null;
}

export interface ArmorInput extends EquipmentInput {
  protection?: number | null;
  current_protection?: number | null;
}

export type SheetInput = Partial<Record<CharacteristicKey, number | null>> & {
  corpus?: CorpusInput[];
  traits?: TraitInput[];
  armors?: ArmorInput[];
  meleeWeapons?: EquipmentInput[];
  rangeWeapons?: EquipmentInput[];
};

/* -------------------------------------------------------------------------- */
/*                                  Calculs                                   */
/* -------------------------------------------------------------------------- */

const n = (value: number | null | undefined) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

export const characteristicValues = (sheet: SheetInput): CharacteristicValues =>
  Object.fromEntries(
    CHARACTERISTICS.map((c) => [c.key, n(sheet[c.key])]),
  ) as CharacteristicValues;

/** Le Corps / L'Esprit / L'Âme : somme des 4 caractères / 5 (tronqué). */
export const groupValue = (values: CharacteristicValues, group: GroupKey) =>
  Math.trunc(
    CHARACTERISTICS.filter((c) => c.group === group).reduce(
      (sum, c) => sum + values[c.key],
      0,
    ) / 5,
  );

/**
 * Coût en expérience d'un caractère : 1 pt d'XP par point jusqu'à 25,
 * 2 de 25 à 50, 4 de 50 à 75 et 8 au-delà de 75.
 */
export const characteristicCost = (value: number) =>
  value +
  Math.max(0, value - 25) +
  2 * Math.max(0, value - 50) +
  4 * Math.max(0, value - 75);

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export type CorpusStat = CharacteristicKey | 'health';

/**
 * Retrouve le caractère visé par un bonus, qu'il soit noté par sa clé
 * (« charisma »), son abréviation (« Cha ») ou son nom (« Charisme »).
 */
export const normalizeStat = (
  stat: string | null | undefined,
): CorpusStat | null => {
  if (!stat) return null;
  const s = normalize(stat);
  if (['health', 'sante'].includes(s)) return 'health';
  const found = CHARACTERISTICS.find(
    (c) => c.key === s || normalize(c.abbr) === s || normalize(c.label) === s,
  );
  return found?.key ?? null;
};

/** Somme des bonus du Corpus portant sur un caractère (ou la santé). */
export const corpusBonus = (
  corpus: CorpusInput[] | undefined,
  stat: CorpusStat,
): number =>
  (corpus ?? []).reduce(
    (sum, entry) =>
      normalizeStat(entry.stat) === stat ? sum + n(entry.bonus) : sum,
    0,
  );

/**
 * Lit un effet écrit comme dans le tableur (« Cha +1 », « Viv+1 »,
 * « Santé +1 ») : utile pour importer les fiches existantes.
 */
export const parseCorpusEffect = (
  effect: string | null | undefined,
): { stat: CorpusStat; bonus: number } | null => {
  const match = (effect ?? '').match(/([\p{L}]+)\s?\+\s?(\d+)/u);
  if (!match) return null;
  const stat = normalizeStat(match[1]);
  return stat ? { stat, bonus: Number(match[2]) } : null;
};

export interface FacultyValue {
  /** Potentiel : majeur + min(majeur, mineur). */
  value: number;
  /** Marge offerte : (majeur au-delà de 50) / 5 + bonus du Corpus. */
  margin: number;
}

export const facultyValue = (
  faculty: Faculty,
  values: CharacteristicValues,
  corpus?: CorpusInput[],
): FacultyValue => {
  const major = values[faculty.major];
  const minor = values[faculty.minor];
  return {
    value: major + Math.min(major, minor),
    margin:
      Math.trunc((Math.max(major, 50) - 50) / 5) +
      corpusBonus(corpus, faculty.major),
  };
};

export const formatFaculty = ({ value, margin }: FacultyValue) =>
  margin !== 0 ? `${value} / +${margin}` : `${value}`;

export interface ComputedSheet {
  values: CharacteristicValues;
  groups: Record<GroupKey, number>;
  /** Coût XP des caractères par groupe, comme la ligne « Exp. : » du tableur. */
  groupCosts: Record<GroupKey, number>;
  characteristicsCost: number;
  faculties: Record<FacultyKey, FacultyValue>;
  mai: number;
  damage: number;
  initiative: number;
  impact: number;
  impulsion: number;
  conduction: number;
  health: number;
  healthThreshold: number;
  stability: number;
  stabilityThreshold: number;
  radiance: number;
  radianceThreshold: number;
  /** Protection des armures équipées. */
  protection: { current: number; max: number };
  /** Encombrement (en %) de l'équipement porté. */
  bulk: number;
  /** Somme des balances des traits innés (0 = équilibré). */
  inbornTraitsBalance: number;
}

export const computeSheet = (sheet: SheetInput): ComputedSheet => {
  const values = characteristicValues(sheet);
  const groups = {
    body: groupValue(values, 'body'),
    spirit: groupValue(values, 'spirit'),
    soul: groupValue(values, 'soul'),
  };
  const groupCosts = Object.fromEntries(
    GROUPS.map((g) => [
      g.key,
      CHARACTERISTICS.filter((c) => c.group === g.key).reduce(
        (sum, c) => sum + characteristicCost(values[c.key]),
        0,
      ),
    ]),
  ) as Record<GroupKey, number>;

  const faculties = Object.fromEntries(
    FACULTIES.map((f) => [f.key, facultyValue(f, values, sheet.corpus)]),
  ) as Record<FacultyKey, FacultyValue>;

  const equippedArmors = (sheet.armors ?? []).filter((a) => a.equipped);
  const equipped = [
    ...equippedArmors,
    ...(sheet.meleeWeapons ?? []).filter((w) => w.equipped),
    ...(sheet.rangeWeapons ?? []).filter((w) => w.equipped),
  ];

  return {
    values,
    groups,
    groupCosts,
    characteristicsCost: groupCosts.body + groupCosts.spirit + groupCosts.soul,
    faculties,
    mai: Math.trunc(groups.soul / 10),
    damage: Math.trunc(values.strength / 10) - 5,
    initiative: Math.trunc(values.vivacity / 10),
    impact: Math.trunc(values.thinking / 10),
    impulsion: Math.trunc(values.perception / 10),
    conduction: Math.trunc(values.concentration / 10),
    health:
      Math.trunc(values.vigour / 10) + corpusBonus(sheet.corpus, 'health'),
    healthThreshold: Math.trunc(values.vigour / 5),
    stability: Math.trunc(values.understanding / 10),
    stabilityThreshold: Math.trunc(values.understanding / 5),
    radiance: Math.trunc(groups.soul / 10),
    radianceThreshold: Math.trunc(groups.soul / 5),
    protection: {
      current: equippedArmors.reduce(
        (sum, a) => sum + n(a.current_protection ?? a.protection),
        0,
      ),
      max: equippedArmors.reduce((sum, a) => sum + n(a.protection), 0),
    },
    bulk: equipped.reduce((sum, e) => sum + n(e.bulk), 0),
    inbornTraitsBalance: (sheet.traits ?? [])
      .filter((t) => t.inborn)
      .reduce((sum, t) => sum + n(t.balance), 0),
  };
};

/* -------------------------------------------------------------------------- */
/*                               Utilitaires                                  */
/* -------------------------------------------------------------------------- */

const ROMAN: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export const toRoman = (value: number | null | undefined) => {
  let rest = Math.trunc(n(value));
  if (rest <= 0) return '-';
  let result = '';
  for (const [v, s] of ROMAN) {
    while (rest >= v) {
      result += s;
      rest -= v;
    }
  }
  return result;
};

/** Vérifie un prérequis d'équipement du type « For 40 ». */
export const meetsPrerequisite = (
  values: CharacteristicValues,
  stat: string | null | undefined,
  value: number | null | undefined,
) => {
  const key = normalizeStat(stat);
  if (!key || key === 'health' || !value) return true;
  return values[key] >= value;
};
