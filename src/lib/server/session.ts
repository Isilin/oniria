import { auth } from '@/app/auth';
import { cache } from 'react';

/**
 * Session de la requête en cours. Le layout et la page en ont tous les deux
 * besoin : elle n'est lue qu'une fois en base par requête.
 */
export const getSession = cache(() => auth());
