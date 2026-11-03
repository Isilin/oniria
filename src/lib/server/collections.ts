import prisma from '@/lib/db/prisma';
import { HttpError } from '@/lib/server/errors';
import {
  CORPUS_TARGET,
  corpusChange,
  skillChange,
  skillTarget,
  SPYREE_MAX,
  spyreeChange,
  spyreeTarget,
  XpChange,
} from '@/lib/rules/xp';
import {
  COLLECTIONS,
  CollectionKey,
  isCollection,
  sanitizeFields,
  XP_COLLECTIONS,
} from '@/lib/sheet/fields';
import { Prisma } from '@prisma/client';
import {
  Actor,
  chargeChange,
  lockSheet,
  readXpPayload,
  Tx,
  XpPayload,
} from './xp';

/**
 * Un élément n'est modifié ou supprimé que s'il appartient à la fiche : la
 * condition est dans la requête elle-même, sans lecture préalable.
 */
type ItemWhere = { id: string; sheetId: string };

/** Délégué Prisma générique. */
interface Delegate {
  create(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  update(args: {
    where: ItemWhere;
    data: Record<string, unknown>;
  }): Promise<unknown>;
  delete(args: { where: ItemWhere }): Promise<unknown>;
}

const NOT_FOUND = 'Élément introuvable.';

/** Aucun élément de cette fiche avec cet id. */
const notFound = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    throw new HttpError(404, NOT_FOUND);
  }
  throw error;
};

/** Relations à renvoyer avec chaque élément créé ou modifié. */
const ITEM_INCLUDE: Partial<Record<CollectionKey, Record<string, unknown>>> = {
  corpus: { type: true },
  spyree: {
    potential: { include: { type: { include: { category: true } } } },
  },
  skills: { skill: true },
  armors: { properties: true },
  meleeWeapons: { properties: true },
  rangeWeapons: { properties: true },
};

export const collectionOf = (key: string, db: Tx = prisma) => {
  if (!isCollection(key)) throw new HttpError(404, 'Liste inconnue.');
  const config = COLLECTIONS[key];
  return {
    key: key as CollectionKey,
    fields: config.fields,
    include: ITEM_INCLUDE[key],
    delegate: db[config.model] as unknown as Delegate,
  };
};

/** Les propriétés d'équipement sont une relation vers le catalogue. */
const toPropertiesRelation = (
  data: Record<string, unknown>,
  mode: 'connect' | 'set',
) => {
  if (!Array.isArray(data.properties)) return;
  data.properties = {
    [mode]: (data.properties as string[]).map((id) => ({ id })),
  };
};

/**
 * Une compétence n'est acquise que si son prérequis l'est déjà (quand elle en
 * a un). Si plusieurs prérequis sont possibles, on retient celui choisi, ou
 * le premier possédé.
 */
const checkSkill = async (
  tx: Tx,
  sheetId: string,
  data: Record<string, unknown>,
) => {
  if (!data.skillId) throw new HttpError(400, 'Compétence manquante.');
  // La compétence et celles déjà acquises par la fiche, lues en une fois.
  const [skill, sheetSkills] = await Promise.all([
    tx.skill.findUnique({
      where: { id: String(data.skillId) },
      include: { prerequisites: { select: { id: true } } },
    }),
    tx.sheetSkill.findMany({
      where: { sheetId },
      select: { skillId: true },
    }),
  ]);
  if (!skill) throw new HttpError(400, 'Compétence inconnue.');

  const ownedSkills = new Set(sheetSkills.map((s) => s.skillId));
  if (ownedSkills.has(skill.id)) {
    throw new HttpError(409, 'Compétence déjà acquise.');
  }

  if (skill.prerequisites.length === 0) {
    data.prerequisiteId = null;
    return skill;
  }
  const ownedIds = skill.prerequisites
    .map((p) => p.id)
    .filter((id) => ownedSkills.has(id));
  if (ownedIds.length === 0) {
    throw new HttpError(400, 'Il manque le prérequis de cette compétence.');
  }
  if (data.prerequisiteId && !ownedIds.includes(String(data.prerequisiteId))) {
    throw new HttpError(400, 'Prérequis non acquis.');
  }
  data.prerequisiteId = data.prerequisiteId ?? ownedIds[0];
  return skill;
};

const checkLevel = (level: unknown) => {
  if (
    typeof level !== 'number' ||
    !Number.isInteger(level) ||
    level < 1 ||
    level > SPYREE_MAX
  ) {
    throw new HttpError(400, `Le rang doit aller de I à ${SPYREE_MAX}.`);
  }
  return level;
};

/**
 * Une écriture qui peut coûter ou rendre de l'XP passe par une transaction
 * qui verrouille la fiche (deux achats simultanés…). Les autres (inventaire,
 * traits, détail d'une compétence…) s'en passent : moins d'allers-retours.
 */
const onSheet = <T>(
  sheetId: string,
  xp: boolean,
  fn: (db: Tx) => Promise<T>,
): Promise<T> =>
  xp
    ? prisma.$transaction(async (tx) => {
        await lockSheet(tx, sheetId);
        return fn(tx);
      })
    : fn(prisma);

/**
 * L'écriture ajoutée au journal d'XP (achat, remboursement…), jointe à la
 * réponse : le client l'ajoute sans recharger la fiche.
 */
const withEntry = <T extends object>(result: T, xpEntry: unknown) =>
  xpEntry ? { ...result, xpEntry } : result;

const charge = (
  tx: Tx,
  sheetId: string,
  change: XpChange | null,
  target: string,
  actor: Actor,
  payload: XpPayload,
) =>
  change
    ? chargeChange(tx, sheetId, { ...change, target }, actor, payload)
    : null;

export const createItem = async (
  sheetId: string,
  key: string,
  body: unknown,
  actor: Actor,
) => {
  const { key: collection, fields } = collectionOf(key);
  const data = sanitizeFields(fields, body);
  const payload = readXpPayload(body);

  return onSheet(sheetId, XP_COLLECTIONS.includes(collection), async (tx) => {
    const { include, delegate } = collectionOf(key, tx);
    let change: XpChange | null = null;

    if (collection === 'skills') {
      change = skillChange(await checkSkill(tx, sheetId, data), false);
    }
    if (collection === 'corpus') {
      if (!data.typeId) throw new HttpError(400, 'Type de Corpus manquant.');
      change = corpusChange(
        await tx.corpus.count({ where: { sheetId } }),
        false,
      );
    }
    if (collection === 'spyree') {
      if (!data.potentialId) throw new HttpError(400, 'Potentiel manquant.');
      const potentialId = String(data.potentialId);
      const [potential, owned] = await Promise.all([
        tx.potential.findUnique({ where: { id: potentialId } }),
        tx.spyree.count({ where: { sheetId, potentialId } }),
      ]);
      if (!potential) throw new HttpError(400, 'Potentiel inconnu.');
      if (owned) throw new HttpError(409, 'Potentiel déjà acquis.');
      data.level = checkLevel(data.level ?? 1);
      change = spyreeChange(potential.name, 0, data.level as number);
    }
    toPropertiesRelation(data, 'connect');

    const item = await delegate.create({
      data: { ...data, sheetId },
      ...(include ? { include } : {}),
    } as { data: Record<string, unknown> });

    const target =
      collection === 'skills'
        ? skillTarget(item.id)
        : collection === 'spyree'
          ? spyreeTarget(item.id)
          : CORPUS_TARGET;
    const charged = await charge(tx, sheetId, change, target, actor, payload);
    return withEntry(item, charged);
  });
};

export const updateItem = async (
  sheetId: string,
  key: string,
  itemId: string,
  body: unknown,
  actor: Actor,
) => {
  const { key: collection, fields } = collectionOf(key);
  const data = sanitizeFields(fields, body);
  const payload = readXpPayload(body);
  // Seul le rang d'un potentiel coûte de l'XP.
  const levelChange = collection === 'spyree' && 'level' in data;

  return onSheet(sheetId, levelChange, async (tx) => {
    const { include, delegate } = collectionOf(key, tx);
    let charged: unknown = null;

    if (collection === 'skills') {
      // On ne change pas la compétence elle-même, seulement son détail.
      delete data.skillId;
      if (data.prerequisiteId) {
        const prerequisiteId = String(data.prerequisiteId);
        const [sheetSkill, owned] = await Promise.all([
          tx.sheetSkill.findFirst({
            where: { id: itemId, sheetId },
            include: {
              skill: { include: { prerequisites: { select: { id: true } } } },
            },
          }),
          tx.sheetSkill.count({
            where: { sheetId, skillId: prerequisiteId },
          }),
        ]);
        if (!sheetSkill) throw new HttpError(404, NOT_FOUND);
        const allowed = sheetSkill.skill.prerequisites.map((p) => p.id);
        if (!allowed.includes(prerequisiteId) || !owned) {
          throw new HttpError(400, 'Prérequis invalide.');
        }
      }
    }

    if (collection === 'spyree') {
      // Le potentiel ne change pas : on en ajoute un autre.
      delete data.potentialId;
      if (levelChange) {
        const current = await tx.spyree.findFirst({
          where: { id: itemId, sheetId },
          include: { potential: true },
        });
        if (!current) throw new HttpError(404, NOT_FOUND);
        const level = checkLevel(data.level);
        charged = await charge(
          tx,
          sheetId,
          spyreeChange(current.potential.name, current.level, level, itemId),
          spyreeTarget(itemId),
          actor,
          payload,
        );
      }
    }
    toPropertiesRelation(data, 'set');

    const item = await delegate
      .update({
        where: { id: itemId, sheetId },
        data,
        ...(include ? { include } : {}),
      } as { where: ItemWhere; data: Record<string, unknown> })
      .catch(notFound);
    return withEntry(item as object, charged);
  });
};

export const deleteItem = async (
  sheetId: string,
  key: string,
  itemId: string,
  actor: Actor,
  payload: XpPayload,
) => {
  const { key: collection } = collectionOf(key);
  return onSheet(sheetId, XP_COLLECTIONS.includes(collection), async (tx) => {
    const { delegate } = collectionOf(key, tx);
    let charged: unknown = null;

    if (collection === 'skills') {
      // On ne retire pas une compétence dont dépendent d'autres compétences.
      const sheetSkill = await tx.sheetSkill.findFirst({
        where: { id: itemId, sheetId },
        include: { skill: true },
      });
      if (!sheetSkill) throw new HttpError(404, NOT_FOUND);
      const dependents = await tx.sheetSkill.findMany({
        where: { sheetId, prerequisiteId: sheetSkill.skillId },
        include: { skill: true },
      });
      if (dependents.length) {
        throw new HttpError(
          409,
          `D'autres compétences en dépendent : ${dependents
            .map((d) => d.skill.name)
            .join(', ')}.`,
        );
      }
      charged = await charge(
        tx,
        sheetId,
        skillChange(sheetSkill.skill, true, itemId),
        skillTarget(itemId),
        actor,
        payload,
      );
    }
    if (collection === 'corpus') {
      // Si l'aspect n'est pas sur la fiche, la suppression échoue et
      // l'écriture d'XP est annulée avec la transaction.
      charged = await charge(
        tx,
        sheetId,
        corpusChange(await tx.corpus.count({ where: { sheetId } }), true),
        CORPUS_TARGET,
        actor,
        payload,
      );
    }
    if (collection === 'spyree') {
      const spyree = await tx.spyree.findFirst({
        where: { id: itemId, sheetId },
        include: { potential: true },
      });
      if (!spyree) throw new HttpError(404, NOT_FOUND);
      charged = await charge(
        tx,
        sheetId,
        spyreeChange(spyree.potential.name, spyree.level, 0, itemId),
        spyreeTarget(itemId),
        actor,
        payload,
      );
    }

    await delegate.delete({ where: { id: itemId, sheetId } }).catch(notFound);
    return charged ? { xpEntry: charged } : null;
  });
};
