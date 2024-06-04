import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginWithGoogle, signIn } from "../../../../lib/firebase/services";
import NextAuth from "next-auth/next";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user: any = await signIn(email);
        if (user) {
          const isPasswordCorrect: boolean = await compare(password, user.password);
          if (isPasswordCorrect) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "credentials") {
        token.email = user.email;
      }

      if (account?.provider === "google") {
        const data = {
          email: profile?.email,
          name: profile?.name,
        };

        await loginWithGoogle(data, (user: { email: string; role: string; fullname: string; phone: string }) => {
          token.email = user.email;
          token.role = user.role;
          token.fullname = user.fullname;
          token.phone = user.phone;
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (session && session.user) {
        if ("email" in token) {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
