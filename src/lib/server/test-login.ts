import { Role } from '@prisma/client';

/**
 * Comptes de test, utilisables uniquement sur l'aperçu Vercel (ou en local),
 * jamais en production. Ils évitent d'avoir à déclarer chaque adresse
 * d'aperçu dans la console Google.
 */
export const TEST_ACCOUNTS = [
  {
    key: 'mj',
    id: 'test-user-mj',
    name: 'MJ de test',
    email: 'mj@test.oniria.invalid',
    role: Role.ADMIN,
  },
  {
    key: 'joueuse',
    id: 'test-user-joueuse',
    name: 'Joueuse de test',
    email: 'joueuse@test.oniria.invalid',
    role: Role.USER,
  },
  {
    key: 'joueur',
    id: 'test-user-joueur',
    name: 'Joueur de test',
    email: 'joueur@test.oniria.invalid',
    role: Role.USER,
  },
] as const;

export type TestAccount = (typeof TEST_ACCOUNTS)[number];

/**
 * Activée seulement si ENABLE_TEST_LOGIN=true ET hors production Vercel :
 * même si la variable était posée par erreur en production, la connexion de
 * test resterait désactivée.
 */
export const isTestLoginEnabled = () =>
  process.env.ENABLE_TEST_LOGIN === 'true' &&
  process.env.VERCEL_ENV !== 'production';
