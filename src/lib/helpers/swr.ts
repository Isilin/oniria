export class RequestError extends Error {
  constructor(
    /** Code HTTP ; 0 quand la requête n'a pas abouti (réseau coupé). */
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Message d'une requête qui n'a pas abouti. Le navigateur dit seulement
 * « Failed to fetch » : on dit ce qui s'est passé et quoi faire.
 */
const offlineMessage = (method: string) =>
  method === 'GET'
    ? "Connexion perdue\u00a0: rien n'a pu être lu. Vérifie ta connexion, puis réessaie."
    : "Connexion perdue\u00a0: la modification n'est pas enregistrée. Vérifie ta connexion, puis réessaie.";

/**
 * Message d'une réponse en erreur. Les erreurs de l'API sont déjà en
 * français ; la session expirée et les pannes du serveur disent en plus
 * quoi faire.
 */
const errorMessage = (status: number, error: unknown) => {
  if (status === 401) return 'Ta session a expiré\u00a0: reconnecte-toi.';
  if (status >= 500) {
    return "Le serveur n'a pas pu répondre. Réessaie dans un instant\u00a0; si ça recommence, préviens le MJ.";
  }
  return typeof error === 'string' && error ? error : `Erreur ${status}.`;
};

/** fetch JSON qui lève une erreur lisible si l'API répond une erreur. */
export const request = async <T = unknown>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new RequestError(0, offlineMessage(method));
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new RequestError(res.status, errorMessage(res.status, data?.error));
  }
  return data as T;
};

export default function fetcher<T>(input: string): Promise<T> {
  return request<T>('GET', input);
}
