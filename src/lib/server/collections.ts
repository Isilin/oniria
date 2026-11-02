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
} from '@/lib/sheet/fields';
import {
  Actor,
  chargeChange,
  lockSheet,
  readXpPayload,
  Tx,
  XpPayload,
} from './xp';

/** Délégué Prisma générique. */
interface Delegate {
  create(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  findFirst(args: { where: Record<string, unknown> }): Promise<unknown>;
  update(args: {
    where: { id: string };
    data: Record<string, unknown>;
  }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
}

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
  const skill = await tx.skill.findUnique({
    where: { id: String(data.skillId) },
    include: { prerequisites: { select: { id: true } } },
  });
  if (!skill) throw new HttpError(400, 'Compétence inconnue.');

  const already = await tx.sheetSkill.findFirst({
    where: { sheetId, skillId: skill.id },
  });
  if (already) throw new HttpError(409, 'Compétence déjà acquise.');

  if (skill.prerequisites.length === 0) {
    data.prerequisiteId = null;
    return skill;
  }
  const owned = await tx.sheetSkill.findMany({
    where: {
      sheetId,
      skillId: { in: skill.prerequisites.map((p) => p.id) },
    },
    select: { skillId: true },
  });
  const ownedIds = owned.map((o) => o.skillId);
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
  const { fields } = collectionOf(key);
  const data = sanitizeFields(fields, body);
  const payload = readXpPayload(body);

  return prisma.$transaction(async (tx) => {
    await lockSheet(tx, sheetId);
    const { key: collection, include, delegate } = collectionOf(key, tx);
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
      const potential = await tx.potential.findUnique({
        where: { id: String(data.potentialId) },
      });
      if (!potential) throw new HttpError(400, 'Potentiel inconnu.');
      const owned = await tx.spyree.count({
        where: { sheetId, potentialId: potential.id },
      });
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
    await charge(tx, sheetId, change, target, actor, payload);
    return item;
  });
};

const findItem = async (
  tx: Tx,
  sheetId: string,
  key: string,
  itemId: string,
) => {
  const collection = collectionOf(key, tx);
  const item = await collection.delegate.findFirst({
    where: { id: itemId, sheetId },
  });
  if (!item) throw new HttpError(404, 'Élément introuvable.');
  return collection;
};

export const updateItem = async (
  sheetId: string,
  key: string,
  itemId: string,
  body: unknown,
  actor: Actor,
) => {
  const { fields } = collectionOf(key);
  const data = sanitizeFields(fields, body);
  const payload = readXpPayload(body);

  return prisma.$transaction(async (tx) => {
    await lockSheet(tx, sheetId);
    const {
      key: collection,
      include,
      delegate,
    } = await findItem(tx, sheetId, key, itemId);

    if (collection === 'skills') {
      // On ne change pas la compétence elle-même, seulement son détail.
      delete data.skillId;
      if (data.prerequisiteId) {
        const sheetSkill = await tx.sheetSkill.findUnique({
          where: { id: itemId },
          include: { skill: { include: { prerequisites: true } } },
        });
        const allowed = sheetSkill.skill.prerequisites.map((p) => p.id);
        const owned = await tx.sheetSkill.count({
          where: { sheetId, skillId: String(data.prerequisiteId) },
        });
        if (!allowed.includes(String(data.prerequisiteId)) || !owned) {
          throw new HttpError(400, 'Prérequis invalide.');
        }
      }
    }

    if (collection === 'spyree') {
      // Le potentiel ne change pas : on en ajoute un autre.
      delete data.potentialId;
      if ('level' in data) {
        const current = await tx.spyree.findUnique({
          where: { id: itemId },
          include: { potential: true },
        });
        const level = checkLevel(data.level);
        await charge(
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

    return delegate.update({
      where: { id: itemId },
      data,
      ...(include ? { include } : {}),
    } as { where: { id: string }; data: Record<string, unknown> });
  });
};

export const deleteItem = async (
  sheetId: string,
  key: string,
  itemId: string,
  actor: Actor,
  payload: XpPayload,
) =>
  prisma.$transaction(async (tx) => {
    await lockSheet(tx, sheetId);
    const { key: collection, delegate } = await findItem(
      tx,
      sheetId,
      key,
      itemId,
    );

    if (collection === 'skills') {
      // On ne retire pas une compétence dont dépendent d'autres compétences.
      const sheetSkill = await tx.sheetSkill.findUnique({
        where: { id: itemId },
        include: { skill: true },
      });
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
      await charge(
        tx,
        sheetId,
        skillChange(sheetSkill.skill, true, itemId),
        skillTarget(itemId),
        actor,
        payload,
      );
    }
    if (collection === 'corpus') {
      await charge(
        tx,
        sheetId,
        corpusChange(await tx.corpus.count({ where: { sheetId } }), true),
        CORPUS_TARGET,
        actor,
        payload,
      );
    }
    if (collection === 'spyree') {
      const spyree = await tx.spyree.findUnique({
        where: { id: itemId },
        include: { potential: true },
      });
      await charge(
        tx,
        sheetId,
        spyreeChange(spyree.potential.name, spyree.level, 0, itemId),
        spyreeTarget(itemId),
        actor,
        payload,
      );
    }

    await delegate.delete({ where: { id: itemId } });
  });
