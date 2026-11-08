import { afterEach, describe, expect, it, vi } from 'vitest';
import { request, RequestError, requestFile } from './swr';

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
    expect(read.message).toMatch(/vérifie ta connexion/);
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

describe('requestFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rend le fichier et le nom annoncé par le serveur', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('%PDF-1.3', {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition':
              'attachment; filename="Eclat.pdf"; filename*=UTF-8\'\'%C3%89clat.pdf',
          },
        }),
      ),
    );
    const { blob, filename } = await requestFile('/api/sheets/1/pdf');
    expect(filename).toBe('Éclat.pdf');
    expect(await blob.text()).toBe('%PDF-1.3');
  });

  it("lit l'erreur JSON de l'API", async () => {
    vi.stubGlobal('fetch', respond(403, { error: 'Réservé aux MJ.' }));
    const e = await failure(requestFile('/api/teams/1/pdf'));
    expect(e.status).toBe(403);
    expect(e.message).toBe('Réservé aux MJ.');
  });

  it('dit que la connexion est perdue', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );
    const e = await failure(requestFile('/api/sheets/1/pdf'));
    expect(e.status).toBe(0);
    expect(e.message).toMatch(/^Connexion perdue/);
  });
});
