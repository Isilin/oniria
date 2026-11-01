import prisma from '@/lib/db/prisma';
import { HttpError } from '@/lib/server/api';
import {
  COLLECTIONS,
  CollectionKey,
  isCollection,
  sanitizeFields,
} from '@/lib/sheet/fields';

/** Délégué Prisma générique. */
interface Delegate {
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
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

export const collectionOf = (key: string) => {
  if (!isCollection(key)) throw new HttpError(404, 'Liste inconnue.');
  const config = COLLECTIONS[key];
  return {
    key: key as CollectionKey,
    fields: config.fields,
    include: ITEM_INCLUDE[key],
    delegate: prisma[config.model] as unknown as Delegate,
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
const checkSkill = async (sheetId: string, data: Record<string, unknown>) => {
  if (!data.skillId) throw new HttpError(400, 'Compétence manquante.');
  const skill = await prisma.skill.findUnique({
    where: { id: String(data.skillId) },
    include: { prerequisites: { select: { id: true } } },
  });
  if (!skill) throw new HttpError(400, 'Compétence inconnue.');

  const already = await prisma.sheetSkill.findFirst({
    where: { sheetId, skillId: skill.id },
  });
  if (already) throw new HttpError(409, 'Compétence déjà acquise.');

  if (skill.prerequisites.length === 0) {
    data.prerequisiteId = null;
    return;
  }
  const owned = await prisma.sheetSkill.findMany({
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
};

export const createItem = async (
  sheetId: string,
  key: string,
  body: unknown,
) => {
  const { key: collection, fields, include, delegate } = collectionOf(key);
  const data = sanitizeFields(fields, body);

  if (collection === 'skills') await checkSkill(sheetId, data);
  if (collection === 'corpus' && !data.typeId) {
    throw new HttpError(400, 'Type de Corpus manquant.');
  }
  if (collection === 'spyree' && !data.potentialId) {
    throw new HttpError(400, 'Potentiel manquant.');
  }
  toPropertiesRelation(data, 'connect');

  return delegate.create({
    data: { ...data, sheetId },
    ...(include ? { include } : {}),
  } as { data: Record<string, unknown> });
};

const findItem = async (sheetId: string, key: string, itemId: string) => {
  const collection = collectionOf(key);
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
) => {
  const {
    key: collection,
    fields,
    include,
    delegate,
  } = await findItem(sheetId, key, itemId);
  const data = sanitizeFields(fields, body);

  if (collection === 'skills') {
    // On ne change pas la compétence elle-même, seulement son détail.
    delete data.skillId;
    if (data.prerequisiteId) {
      const sheetSkill = await prisma.sheetSkill.findUnique({
        where: { id: itemId },
        include: { skill: { include: { prerequisites: true } } },
      });
      const allowed = sheetSkill.skill.prerequisites.map((p) => p.id);
      const owned = await prisma.sheetSkill.count({
        where: { sheetId, skillId: String(data.prerequisiteId) },
      });
      if (!allowed.includes(String(data.prerequisiteId)) || !owned) {
        throw new HttpError(400, 'Prérequis invalide.');
      }
    }
  }
  toPropertiesRelation(data, 'set');

  return delegate.update({
    where: { id: itemId },
    data,
    ...(include ? { include } : {}),
  } as { where: { id: string }; data: Record<string, unknown> });
};

export const deleteItem = async (
  sheetId: string,
  key: string,
  itemId: string,
) => {
  const { key: collection, delegate } = await findItem(sheetId, key, itemId);

  if (collection === 'skills') {
    // On ne retire pas une compétence dont dépendent d'autres compétences.
    const sheetSkill = await prisma.sheetSkill.findUnique({
      where: { id: itemId },
    });
    const dependents = await prisma.sheetSkill.findMany({
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
  }

  await delegate.delete({ where: { id: itemId } });
};
