import prisma from '@/lib/db/prisma';
import { HttpError } from '@/lib/server/errors';
import {
  CORPUS_TARGET,
  corpusChange,
  itemChange,
  skillChange,
  skillTarget,
  SPYREE_MAX,
  spyreeChange,
  spyreeTarget,
  XpChange,
  XpItemsInput,
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
 * Un élément n'est modifié ou supprimé que s'il appartient à la fiche (et,
 * selon le cas, s'il est rayé ou non) : la condition est dans la requête
 * elle-même, sans lecture préalable.
 */
type ItemWhere = {
  id: string;
  sheetId: string;
  lostAt?: null | { not: null };
};

/** Délégué Prisma générique. */
interface Delegate {
  create(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  update(args: {
    where: ItemWhere;
    data: Record<string, unknown>;
  }): Promise<unknown>;
  delete(args: { where: ItemWhere }): Promise<unknown>;
}

/** Modifier un élément rayé : il faut d'abord que le MJ le rétablisse. */
const NOT_FOUND_OR_LOST = 'Élément introuvable, ou rayé.';
const ALREADY_STRUCK = 'Élément introuvable, ou déjà rayé.';
const NOT_STRUCK = 'Élément introuvable, ou pas rayé.';
/** Un élément rayé garde la trace de ce qui a été perdu : le MJ seul y touche. */
const LOST_DELETE =
  'Élément introuvable, ou rayé : seul le MJ peut supprimer un élément rayé.';

const isAdmin = (actor: Actor) => actor.role === 'ADMIN';

/** Aucun élément de cette fiche avec cet id (et dans cet état). */
const notFound =
  (message: string) =>
  (error: unknown): never => {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new HttpError(404, message);
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
      select: { skillId: true, lostAt: true },
    }),
  ]);
  if (!skill) throw new HttpError(400, 'Compétence inconnue.');

  const already = sheetSkills.find((s) => s.skillId === skill.id);
  if (already) {
    throw new HttpError(
      409,
      already.lostAt
        ? 'Compétence rayée : le MJ peut la rétablir.'
        : 'Compétence déjà acquise.',
    );
  }
  // Une compétence rayée ne sert plus de prérequis.
  const ownedSkills = new Set(
    sheetSkills.filter((s) => !s.lostAt).map((s) => s.skillId),
  );

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

const targetOf = (collection: CollectionKey, itemId: string) =>
  collection === 'skills'
    ? skillTarget(itemId)
    : collection === 'spyree'
      ? spyreeTarget(itemId)
      : CORPUS_TARGET;

/** Ce que coûte un élément retiré, rayé ou rétabli (voir `itemChange`). */
const chargeItem = (
  tx: Tx,
  sheetId: string,
  items: XpItemsInput,
  collection: CollectionKey,
  itemId: string,
  action: 'remove' | 'strike' | 'restore',
  actor: Actor,
  payload: XpPayload,
) =>
  charge(
    tx,
    sheetId,
    itemChange(items, collection, itemId, action),
    targetOf(collection, itemId),
    actor,
    payload,
  );

/** Le Corpus se paie au rang : il faut tous ses aspects, rayés ou non. */
const corpusOf = (tx: Tx, sheetId: string) =>
  tx.corpus.findMany({
    where: { sheetId },
    select: { id: true, name: true, lostAt: true },
  });

interface XpItems extends XpItemsInput {
  skills?: Prisma.SheetSkillGetPayload<{ include: { skill: true } }>[];
}

/**
 * Ce dont `itemChange` a besoin pour un élément d'une liste à XP : la
 * compétence ou le potentiel lui-même, tous les aspects du Corpus.
 * `null` si l'élément n'est pas sur la fiche (ou pas dans l'état voulu).
 */
const xpItems = async (
  tx: Tx,
  sheetId: string,
  collection: CollectionKey,
  where: ItemWhere,
): Promise<XpItems | null> => {
  if (collection === 'skills') {
    const owned = await tx.sheetSkill.findFirst({
      where,
      include: { skill: true },
    });
    return owned && { skills: [owned] };
  }
  if (collection === 'spyree') {
    const owned = await tx.spyree.findFirst({
      where,
      include: { potential: true },
    });
    return owned && { spyree: [owned] };
  }
  return { corpus: await corpusOf(tx, sheetId) };
};

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
      // Le rang ne compte que les aspects actifs.
      change = corpusChange(
        await tx.corpus.count({ where: { sheetId, lostAt: null } }),
        false,
      );
    }
    if (collection === 'spyree') {
      if (!data.potentialId) throw new HttpError(400, 'Potentiel manquant.');
      const potentialId = String(data.potentialId);
      const [potential, owned] = await Promise.all([
        tx.potential.findUnique({ where: { id: potentialId } }),
        tx.spyree.findFirst({
          where: { sheetId, potentialId },
          select: { lostAt: true },
        }),
      ]);
      if (!potential) throw new HttpError(400, 'Potentiel inconnu.');
      if (owned) {
        throw new HttpError(
          409,
          owned.lostAt
            ? 'Potentiel rayé : le MJ peut le rétablir.'
            : 'Potentiel déjà acquis.',
        );
      }
      data.level = checkLevel(data.level ?? 1);
      change = spyreeChange(potential.name, 0, data.level as number);
    }
    toPropertiesRelation(data, 'connect');

    const item = await delegate.create({
      data: { ...data, sheetId },
      ...(include ? { include } : {}),
    } as { data: Record<string, unknown> });

    const charged = await charge(
      tx,
      sheetId,
      change,
      targetOf(collection, item.id),
      actor,
      payload,
    );
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
  // Un élément rayé ne se modifie plus : le MJ le rétablit d'abord.
  const where: ItemWhere = { id: itemId, sheetId, lostAt: null };

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
            where,
            include: {
              skill: { include: { prerequisites: { select: { id: true } } } },
            },
          }),
          tx.sheetSkill.count({
            where: { sheetId, skillId: prerequisiteId, lostAt: null },
          }),
        ]);
        if (!sheetSkill) throw new HttpError(404, NOT_FOUND_OR_LOST);
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
          where,
          include: { potential: true },
        });
        if (!current) throw new HttpError(404, NOT_FOUND_OR_LOST);
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
        where,
        data,
        ...(include ? { include } : {}),
      } as { where: ItemWhere; data: Record<string, unknown> })
      .catch(notFound(NOT_FOUND_OR_LOST));
    return withEntry(item as object, charged);
  });
};

/**
 * Supprime un élément. Celui d'une partie validée rend sa valeur (MJ seul :
 * remboursement ou perte) ; un élément rayé ne rend plus rien, son XP a été
 * perdue en le rayant, et seul le MJ peut le supprimer.
 */
export const deleteItem = async (
  sheetId: string,
  key: string,
  itemId: string,
  actor: Actor,
  payload: XpPayload,
) => {
  const { key: collection } = collectionOf(key);
  const where: ItemWhere = isAdmin(actor)
    ? { id: itemId, sheetId }
    : { id: itemId, sheetId, lostAt: null };
  return onSheet(sheetId, XP_COLLECTIONS.includes(collection), async (tx) => {
    const { delegate } = collectionOf(key, tx);
    let charged: unknown = null;

    if (XP_COLLECTIONS.includes(collection)) {
      const items = await xpItems(tx, sheetId, collection, where);
      if (!items) throw new HttpError(404, LOST_DELETE);
      // On ne retire pas une compétence dont dépendent d'autres compétences.
      const owned = items.skills?.[0];
      if (owned) {
        const dependents = await tx.sheetSkill.findMany({
          where: { sheetId, prerequisiteId: owned.skillId },
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
      // Un aspect absent du Corpus : la suppression échoue et l'écriture
      // d'XP est annulée avec la transaction.
      charged = await chargeItem(
        tx,
        sheetId,
        items,
        collection,
        itemId,
        'remove',
        actor,
        payload,
      );
    }

    await delegate.delete({ where }).catch(notFound(LOST_DELETE));
    return charged ? { xpEntry: charged } : null;
  });
};

/**
 * Le MJ raye un élément : il reste sur la fiche, barré et sans effet. Dans
 * une partie validée, l'XP payée pour lui est perdue (écriture « XP
 * perdue », gardée aussi sur l'élément dans `lostXp`). Une compétence dont
 * d'autres compétences actives dépendent ne se raye pas.
 */
export const strikeItem = async (
  sheetId: string,
  key: string,
  itemId: string,
  actor: Actor,
) => {
  const { key: collection } = collectionOf(key);
  if (!isAdmin(actor)) {
    throw new HttpError(403, 'Seul le MJ peut rayer un élément.');
  }
  const xp = XP_COLLECTIONS.includes(collection);
  const where: ItemWhere = { id: itemId, sheetId, lostAt: null };

  return onSheet(sheetId, xp, async (tx) => {
    const { include, delegate } = collectionOf(key, tx);
    let charged: Awaited<ReturnType<typeof chargeChange>> = null;

    if (xp) {
      const items = await xpItems(tx, sheetId, collection, where);
      if (!items) throw new HttpError(404, ALREADY_STRUCK);
      const owned = items.skills?.[0];
      if (owned) {
        const dependents = await tx.sheetSkill.findMany({
          where: { sheetId, prerequisiteId: owned.skillId, lostAt: null },
          include: { skill: true },
        });
        if (dependents.length) {
          throw new HttpError(
            409,
            `D'autres compétences en dépendent : ${dependents
              .map((d) => d.skill.name)
              .join(', ')}. Les rayer d'abord.`,
          );
        }
      }
      charged = await chargeItem(
        tx,
        sheetId,
        items,
        collection,
        itemId,
        'strike',
        actor,
        { refund: false },
      );
    }

    const lost = charged ? charged.feel + charged.learn + charged.live : 0;
    const item = await delegate
      .update({
        where,
        data: { lostAt: new Date(), ...(xp ? { lostXp: lost || null } : {}) },
        ...(include ? { include } : {}),
      } as { where: ItemWhere; data: Record<string, unknown> })
      .catch(notFound(ALREADY_STRUCK));
    return withEntry(item as object, charged);
  });
};

/**
 * Le MJ rétablit un élément rayé. Dans une partie validée, sa valeur est un
 * achat : offert par le MJ ou payé avec l'XP du personnage (`xp` du corps).
 * Une compétence ne revient que si l'un de ses prérequis est actif.
 */
export const restoreItem = async (
  sheetId: string,
  key: string,
  itemId: string,
  body: unknown,
  actor: Actor,
) => {
  const { key: collection } = collectionOf(key);
  if (!isAdmin(actor)) {
    throw new HttpError(403, 'Seul le MJ peut rétablir un élément rayé.');
  }
  const payload = readXpPayload(body);
  const xp = XP_COLLECTIONS.includes(collection);
  const where: ItemWhere = { id: itemId, sheetId, lostAt: { not: null } };

  return onSheet(sheetId, xp, async (tx) => {
    const { include, delegate } = collectionOf(key, tx);
    const data: Record<string, unknown> = {
      lostAt: null,
      ...(xp ? { lostXp: null } : {}),
    };
    let charged: unknown = null;

    if (xp) {
      const items = await xpItems(tx, sheetId, collection, where);
      if (!items) throw new HttpError(404, NOT_STRUCK);
      const owned = items.skills?.[0];
      if (owned) {
        const prerequisites = await tx.skill.findUnique({
          where: { id: owned.skillId },
          select: { prerequisites: { select: { id: true } } },
        });
        const required = prerequisites?.prerequisites.map((p) => p.id) ?? [];
        if (required.length) {
          const active = await tx.sheetSkill.findMany({
            where: { sheetId, skillId: { in: required }, lostAt: null },
            select: { skillId: true },
          });
          if (active.length === 0) {
            throw new HttpError(
              400,
              'Il manque le prérequis de cette compétence : le rétablir (ou l’acquérir) d’abord.',
            );
          }
          // Le prérequis par lequel elle avait été acquise a pu être rayé.
          if (!active.some((a) => a.skillId === owned.prerequisiteId)) {
            data.prerequisiteId = active[0].skillId;
          }
        }
      }
      charged = await chargeItem(
        tx,
        sheetId,
        items,
        collection,
        itemId,
        'restore',
        actor,
        payload,
      );
    }

    const item = await delegate
      .update({
        where,
        data,
        ...(include ? { include } : {}),
      } as { where: ItemWhere; data: Record<string, unknown> })
      .catch(notFound(NOT_STRUCK));
    return withEntry(item as object, charged);
  });
};
