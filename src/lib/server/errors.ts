/** Erreur renvoyée telle quelle par l'API, avec son code HTTP. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
