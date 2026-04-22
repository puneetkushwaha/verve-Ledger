import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Verve Ledger Secure Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { shop: true }
          });

          if (!user) {
            console.error("User not found in DB:", credentials.email);
            return null;
          }

          console.log("User found, verifying password...");
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            console.error("Invalid password for user:", credentials.email);
            return null;
          }

          console.log("Login successful for:", credentials.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            shopId: user.shopId,
            plan: user.shop?.plan,
            planExpiry: user.shop?.planExpiry,
          };

        } catch (error) {
          console.error("Auth error during authorize callback:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.shopId = user.shopId;
        token.id = user.id;
        token.plan = user.plan;
        token.planExpiry = user.planExpiry;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.shopId = token.shopId;
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.planExpiry = token.planExpiry;
      }
      return session;
    }

  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
