import { afterEach, describe, expect, it, vi } from 'vitest';
import { request, RequestError } from './swr';

const respond = (status: number, body: unknown) =>
  vi.fn().mockResolvedValue(
    new Response(body === undefined ? 'oups' : JSON.stringify(body), {
      status,
    }),
  );

const failure = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (e) {
    return e as RequestError;
  }
  throw new Error('La requête aurait dû échouer.');
};

describe('request', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('dit en français que la connexion est perdue', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );
    const read = await failure(request('GET', '/api/sheets'));
    expect(read.status).toBe(0);
    expect(read.message).toMatch(/^Connexion perdue/);
    expect(read.message).toMatch(/rien n'a pu être lu/);
    const write = await failure(request('PATCH', '/api/sheets/1', {}));
    expect(write.message).toMatch(/n'est pas enregistrée/);
  });

  it("garde le message de l'API", async () => {
    vi.stubGlobal('fetch', respond(400, { error: 'Nom manquant.' }));
    const e = await failure(request('POST', '/api/teams', { name: '' }));
    expect(e.status).toBe(400);
    expect(e.message).toBe('Nom manquant.');
  });

  it('dit quoi faire quand la session a expiré ou le serveur est en panne', async () => {
    vi.stubGlobal('fetch', respond(401, { error: 'Non connecté.' }));
    expect((await failure(request('GET', '/api/sheets'))).message).toMatch(
      /session a expiré/,
    );
    // Une réponse sans JSON (délai dépassé chez l'hébergeur, par exemple).
    vi.stubGlobal('fetch', respond(504, undefined));
    expect((await failure(request('GET', '/api/sheets'))).message).toMatch(
      /préviens le MJ/,
    );
  });

  it('renvoie les données', async () => {
    vi.stubGlobal('fetch', respond(200, { id: 'x' }));
    await expect(request('GET', '/api/sheets/x')).resolves.toEqual({ id: 'x' });
  });
});
