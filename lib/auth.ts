import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export const authConfig: NextAuthConfig = {
  // Use JWT sessions to avoid DB dependency for session storage
  session: { strategy: 'jwt' },
  providers: [
    Google,
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.password) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error augment role on session
        session.user.role = (token as any)?.role ?? 'CUSTOMER'
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id as string } })
        token.role = dbUser?.role ?? 'CUSTOMER'
      }
      return token
    }
  },
  pages: {
    signIn: '/login'
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig)
