/**
 * Des enregistrements d'une fiche qui se suivent de près (−/+ en rafale sur
 * une Existence, par exemple) :
 * - une réponse plus ancienne n'écrase pas à l'écran une valeur plus récente
 *   encore en route ;
 * - ils partent l'un après l'autre, pour que le dernier clic soit aussi le
 *   dernier écrit en base.
 *
 * Sans cela, trois − puis trois + rapides à partir de 3 finissaient à 2 :
 * chaque réponse remettait l'écran en arrière, et le + suivant partait de
 * cette valeur périmée.
 */

type Fields = Record<string, unknown>;

/** La dernière modification locale de chaque champ, par portée (une URL). */
export const createFieldVersions = () => {
  const versions = new Map<string, number>();
  const id = (scope: string, key: string) => `${scope}#${key}`;
  return {
    /** Note une nouvelle modification locale de ces champs ; rend leurs versions. */
    bump(scope: string, keys: string[]): Record<string, number> {
      return Object.fromEntries(
        keys.map((key) => {
          const version = (versions.get(id(scope, key)) ?? 0) + 1;
          versions.set(id(scope, key), version);
          return [key, version];
        }),
      );
    },
    /** Vrai si aucune modification plus récente de ce champ n'a suivi. */
    isLatest(scope: string, key: string, version: number | undefined) {
      return versions.get(id(scope, key)) === version;
    },
  };
};

/**
 * Une file par portée : chaque tâche attend la fin de la précédente, qu'elle
 * ait réussi ou échoué.
 */
export const createQueue = () => {
  const tails = new Map<string, Promise<unknown>>();
  return <T>(scope: string, run: () => Promise<T>): Promise<T> => {
    const previous = tails.get(scope) ?? Promise.resolve();
    const next = previous.then(run, run);
    const tail = next.catch(() => undefined);
    tails.set(scope, tail);
    // La file vide ne garde rien en mémoire.
    void tail.then(() => {
      if (tails.get(scope) === tail) tails.delete(scope);
    });
    return next;
  };
};

/**
 * Ce que le serveur confirme : les champs envoyés qu'aucune modification plus
 * récente n'a remplacés, et les relations (type, propriétés, journal d'XP…).
 */
export const confirmedFields = (
  saved: Fields | null,
  patch: Fields,
  isCurrent: (key: string) => boolean,
) =>
  Object.fromEntries(
    Object.entries(saved ?? {}).filter(
      ([key, value]) =>
        (key in patch && isCurrent(key)) ||
        (value !== null && typeof value === 'object'),
    ),
  );

/** Ce qu'on rétablit après un échec : seulement les champs pas modifiés depuis. */
export const undoneFields = (
  previous: Fields,
  isCurrent: (key: string) => boolean,
) =>
  Object.fromEntries(
    Object.entries(previous).filter(([key]) => isCurrent(key)),
  );
