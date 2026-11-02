import prisma from '@/lib/db/prisma';
import { ensureTestData } from '@/lib/server/test-data';
import { isTestLoginEnabled, TEST_ACCOUNTS } from '@/lib/server/test-login';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SESSION_DAYS = 30;

/**
 * Connexion de test (aperçu uniquement) : crée une session Auth.js en base
 * pour un compte de test, puis pose le cookie de session comme le ferait
 * une connexion Google.
 */
export async function GET(req: NextRequest) {
  if (!isTestLoginEnabled()) {
    return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });
  }

  const account = TEST_ACCOUNTS.find(
    (a) => a.key === req.nextUrl.searchParams.get('as'),
  );
  if (!account) {
    return NextResponse.json({ error: 'Compte inconnu.' }, { status: 400 });
  }

  // Comptes et personnages de test créés à la première connexion.
  await ensureTestData(prisma);
  const user = account;

  const sessionToken = randomUUID();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  await prisma.session.create({
    data: { sessionToken, userId: user.id, expires },
  });

  const secure =
    req.nextUrl.protocol === 'https:' ||
    req.headers.get('x-forwarded-proto') === 'https';
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.set({
    name: `${secure ? '__Secure-' : ''}authjs.session-token`,
    value: sessionToken,
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    expires,
  });
  return response;
}
