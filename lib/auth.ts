import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login", error: "/auth/login" },
  providers: [
    CredentialsProvider({
      name: "E-mail e senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() })
          .select("+passwordHash");
        if (!user?.passwordHash || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isMinor: user.isMinor,
          isGuardianApproved: user.isGuardianApproved
        } as any;
      }
    }),
    EmailProvider({
      server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
      from: "MentorTech <no-reply@example.com>",
      async sendVerificationRequest({ identifier, url }) {
        const key = process.env.RESEND_API_KEY;
        if (!key) {
          if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY ausente.");
          console.info(`[MentorTech] Link de acesso para ${identifier}: ${url}`);
          return;
        }
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL ?? "MentorTech <onboarding@resend.dev>",
            to: identifier,
            subject: "Seu link de acesso ao MentorTech",
            html: `<p><a href="${url}">Acessar MentorTech</a></p>`
          })
        });
        if (!response.ok) throw new Error("Não foi possível enviar o link de acesso.");
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "email" && user.email) {
        await connectDB();
        const record = await User.findOne({ email: user.email.toLowerCase() });
        return record?.role === "guardian";
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      if (token.sub) {
        await connectDB();
        const record = await User.findById(token.sub);
        if (record) {
          token.role = record.role;
          token.isMinor = record.isMinor;
          token.isGuardianApproved = record.isGuardianApproved;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isMinor = Boolean(token.isMinor);
        session.user.isGuardianApproved = Boolean(token.isGuardianApproved);
      }
      return session;
    }
  }
};