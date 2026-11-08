import { describe, expect, it } from 'vitest';
import {
  confirmedFields,
  createFieldVersions,
  createQueue,
  undoneFields,
} from './sync';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('createFieldVersions', () => {
  it('une modification plus récente rend la précédente périmée', () => {
    const versions = createFieldVersions();
    const first = versions.bump('/fiche', ['current_health']);
    expect(
      versions.isLatest('/fiche', 'current_health', first.current_health),
    ).toBe(true);
    const second = versions.bump('/fiche', ['current_health']);
    expect(
      versions.isLatest('/fiche', 'current_health', first.current_health),
    ).toBe(false);
    expect(
      versions.isLatest('/fiche', 'current_health', second.current_health),
    ).toBe(true);
  });

  it('les champs et les fiches sont suivis séparément', () => {
    const versions = createFieldVersions();
    const health = versions.bump('/a', ['current_health']);
    versions.bump('/a', ['current_mai']);
    versions.bump('/b', ['current_health']);
    expect(
      versions.isLatest('/a', 'current_health', health.current_health),
    ).toBe(true);
  });
});

describe('confirmedFields', () => {
  it("n'écrase pas un champ modifié depuis l'envoi, garde les relations", () => {
    const saved = {
      current_health: 2,
      current_mai: 4,
      type: { id: 't' },
      note: null,
    };
    const patch = { current_health: 2, current_mai: 4 };
    const fresh = confirmedFields(
      saved,
      patch,
      (key) => key !== 'current_health',
    );
    expect(fresh).toEqual({ current_mai: 4, type: { id: 't' } });
  });
});

describe('undoneFields', () => {
  it('ne rétablit que les champs pas modifiés depuis', () => {
    expect(
      undoneFields(
        { current_health: 3, current_mai: 4 },
        (key) => key === 'current_mai',
      ),
    ).toEqual({ current_mai: 4 });
  });
});

describe('createQueue', () => {
  it('lance chaque tâche après la fin de la précédente, dans l’ordre', async () => {
    const inOrder = createQueue();
    const log: string[] = [];
    const task = (name: string, ms: number) => async () => {
      log.push(`début ${name}`);
      await delay(ms);
      log.push(`fin ${name}`);
      return name;
    };
    const results = await Promise.all([
      inOrder('/fiche', task('lent', 30)),
      inOrder('/fiche', task('rapide', 1)),
    ]);
    expect(results).toEqual(['lent', 'rapide']);
    expect(log).toEqual([
      'début lent',
      'fin lent',
      'début rapide',
      'fin rapide',
    ]);
  });

  it('un échec ne bloque pas la suite, et reste visible pour qui l’attend', async () => {
    const inOrder = createQueue();
    const failing = inOrder('/fiche', async () => {
      throw new Error('refusé');
    });
    const next = inOrder('/fiche', async () => 'suite');
    await expect(failing).rejects.toThrow('refusé');
    await expect(next).resolves.toBe('suite');
  });

  it('deux fiches ne s’attendent pas', async () => {
    const inOrder = createQueue();
    const log: string[] = [];
    await Promise.all([
      inOrder('/a', async () => {
        await delay(20);
        log.push('a');
      }),
      inOrder('/b', async () => {
        log.push('b');
      }),
    ]);
    expect(log).toEqual(['b', 'a']);
  });
});
