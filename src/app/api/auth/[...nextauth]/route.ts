import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.RESEND_API_KEY || "",
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    }),
    // Provider de test pour le développement
    CredentialsProvider({
      id: "test",
      name: "Test Account",
      credentials: {
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.code === "menuqr2025") {
          return {
            id: "test-user-123",
            email: "test@menuqr.com",
            name: "Test User",
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: any; user: any }) => {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
