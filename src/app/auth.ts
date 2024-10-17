import { PrismaAdapter } from '@auth/prisma-adapter';
import { Role } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import { db } from '../lib/helpers/db';

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
      const dbUser = await db.whitelist.findUnique({
        where: { email: profile.email },
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
  adapter: PrismaAdapter(db),
  providers: [Google],
});
