export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** fetch JSON qui lève une erreur lisible si l'API répond une erreur. */
export const request = async <T = unknown>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> => {
  const res = await fetch(url, {
    method,
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new RequestError(res.status, data?.error ?? `Erreur ${res.status}`);
  }
  return data as T;
};

export default function fetcher<T>(input: string): Promise<T> {
  return request<T>('GET', input);
}
