import { Prisma } from '@prisma/client';
import { HttpError } from './errors';

/** Une adresse en double devient un message que le MJ comprend. */
export const explainDuplicate = async <T>(write: () => Promise<T>) => {
  try {
    return await write();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new HttpError(409, 'Cette adresse est déjà dans la whitelist.');
    }
    throw error;
  }
};

/** Adresse de la whitelist : sans espaces, en minuscules, au format email. */
export const normalizeEmail = (email: unknown) => {
  const normalized = String(email ?? '')
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+$/.test(normalized)) {
    throw new HttpError(400, 'Adresse email invalide.');
  }
  return normalized;
};
