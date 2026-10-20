import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
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
          if (!user) {
            console.error("Auth: user not found for", credentials.email);
            return null;
          }
          if (user.blocked) {
            console.error("Auth: blocked user tried to sign in:", credentials.email);
            return null;
          }
          if (!user.emailVerified) {
            console.error("Auth: email not verified for", credentials.email, "- auto-verifying");
            user.emailVerified = true;
            await user.save();
          }
          const valid = await bcrypt.compare(credentials.pin, user.pinHash);
          if (!valid) {
            console.error("Auth: invalid PIN for", credentials.email);
            return null;
          }
          return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
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
    async jwt({ token, user, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      if (session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.name) session.user.name = token.name;
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
