import prisma from '@/lib/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Role } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession['user'];
  }
  interface User {
    role?: Role;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false;
      const dbUser = await prisma.whitelist.findFirst({
        where: { email: { equals: profile.email, mode: 'insensitive' } },
      });

      return !!dbUser;
    },

    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
        },
      };
    },
  },
  session: {
    strategy: 'database',
  },
  // Un refus (adresse hors whitelist) ou un échec revient à l'accueil, qui
  // l'explique dans le carnet (`?error=…`), au lieu de la page d'Auth.js.
  pages: { error: '/' },
  adapter: PrismaAdapter(prisma),
  providers: [Google],
});
