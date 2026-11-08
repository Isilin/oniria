import { SKILL_TYPES } from './fields';

/** Ce dont l'arbre a besoin d'une compétence acquise (`SheetSkill`). */
export interface OwnedSkill {
  id: string;
  skillId: string;
  prerequisiteId: string | null;
}

/**
 * Arbre des compétences acquises : une compétence est rangée sous le
 * prérequis qui l'a permise, s'il est acquis aussi ; sinon elle est à la
 * racine. Une boucle de prérequis (données anciennes) ne fait rien perdre :
 * la première compétence de la boucle passe à la racine.
 */
export const skillTree = <T extends OwnedSkill>(owned: T[]) => {
  const ownedIds = new Set(owned.map((s) => s.skillId));
  const childrenOf = new Map<string, T[]>();
  const roots: T[] = [];
  for (const skill of owned) {
    const parent = skill.prerequisiteId;
    if (parent && parent !== skill.skillId && ownedIds.has(parent)) {
      childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), skill]);
    } else {
      roots.push(skill);
    }
  }

  const reached = new Set<string>();
  const visit = (skill: T) => {
    if (reached.has(skill.id)) return;
    reached.add(skill.id);
    for (const child of childrenOf.get(skill.skillId) ?? []) visit(child);
  };
  roots.forEach(visit);
  for (const skill of owned) {
    if (reached.has(skill.id)) continue;
    // Dans une boucle : on la coupe ici.
    const parent = skill.prerequisiteId as string;
    childrenOf.set(
      parent,
      (childrenOf.get(parent) ?? []).filter((c) => c !== skill),
    );
    roots.push(skill);
    visit(skill);
  }

  return { roots, childrenOf, ownedIds };
};

/**
 * Les racines de l'arbre rangées par type (Générales, Spyrales, Martiales),
 * puis par catégorie, dans l'ordre d'acquisition.
 */
export const rootsByType = <T extends OwnedSkill>(
  roots: T[],
  skillOf: (owned: T) => { type: string; category: string },
) =>
  SKILL_TYPES.map((type) => {
    const typeRoots = roots.filter((r) => skillOf(r).type === type);
    const categories = [...new Set(typeRoots.map((r) => skillOf(r).category))];
    return {
      type,
      categories: categories.map((category) => ({
        category,
        roots: typeRoots.filter((r) => skillOf(r).category === category),
      })),
    };
  });
