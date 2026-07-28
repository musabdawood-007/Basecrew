import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "PIN",
      credentials: {
        email: { label: "Email", type: "email" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.pin) return null;
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          if (!user) return null;
          if (!user.emailVerified) return null;
          const valid = await bcrypt.compare(credentials.pin, user.pinHash);
          if (!valid) return null;
          return { id: user._id.toString(), name: user.name, email: user.email };
        } catch (e) {
          console.error("Auth error:", e);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
