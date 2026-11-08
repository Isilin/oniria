import { describe, expect, it } from 'vitest';
import { rootsByType, skillTree } from './skill-tree';

const owned = (
  id: string,
  skillId: string,
  prerequisiteId: string | null = null,
  skill = { type: 'GENERAL', category: 'Arts' },
) => ({ id, skillId, prerequisiteId, skill });

describe('arbre des compétences', () => {
  it('range une compétence sous son prérequis acquis', () => {
    const base = owned('a', 'base');
    const principle = owned('b', 'principle', 'base');
    const { roots, childrenOf } = skillTree([base, principle]);
    expect(roots).toEqual([base]);
    expect(childrenOf.get('base')).toEqual([principle]);
  });

  it('laisse à la racine une compétence dont le prérequis manque', () => {
    const orphan = owned('b', 'principle', 'base');
    expect(skillTree([orphan]).roots).toEqual([orphan]);
  });

  it('ne perd rien dans une boucle de prérequis', () => {
    const a = owned('a', 'x', 'y');
    const b = owned('b', 'y', 'x');
    const { roots, childrenOf } = skillTree([a, b]);
    expect(roots).toEqual([a]);
    expect(childrenOf.get('x')).toEqual([b]);
    expect(childrenOf.get('y')).toEqual([]);
  });

  it('ignore un prérequis qui désigne la compétence elle-même', () => {
    const self = owned('a', 'x', 'x');
    expect(skillTree([self]).roots).toEqual([self]);
  });

  it('classe les racines par type puis par catégorie', () => {
    const arts = owned('a', 'arts');
    const combat = owned('b', 'sword', null, {
      type: 'MARTIAL',
      category: 'Épée',
    });
    const music = owned('c', 'music', null, {
      type: 'GENERAL',
      category: 'Musique',
    });
    const groups = rootsByType([arts, combat, music], (o) => o.skill);
    expect(groups.map((g) => g.type)).toEqual(['GENERAL', 'SPYRAL', 'MARTIAL']);
    expect(groups[0].categories).toEqual([
      { category: 'Arts', roots: [arts] },
      { category: 'Musique', roots: [music] },
    ]);
    expect(groups[1].categories).toEqual([]);
    expect(groups[2].categories[0].roots).toEqual([combat]);
  });
});
