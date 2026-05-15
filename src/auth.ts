// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validasi input pake Zod biar aman
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Cari user di Neon DB pake Drizzle
          const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
          
          if (!user[0]) return null;

          // Cek apakah password cocok
          const passwordsMatch = await bcrypt.compare(password, user[0].password);
          
          if (passwordsMatch) {
            // Return object user ini bakal masuk ke JWT session
            return {
              id: user[0].id.toString(),
              name: user[0].name,
              email: user[0].email,
              role: user[0].role,
            };
          }
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});