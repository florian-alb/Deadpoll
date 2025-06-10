import NextAuth from "next-auth";

import bcrypt from "bcryptjs";

import { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { collections } from "@/lib/collections";
import clientPromise, { dbName } from "@/lib/mongodb";

const providers: Provider[] = [
  GitHub({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }),
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const client = await clientPromise;
      const db = client.db(dbName);
      const user = await db
        .collection(collections.users)
        .findOne({ email: credentials.email });

      if (!user) return null;

      const valid = await bcrypt.compare(
        credentials.password as string,
        user.passwordHash
      );

      if (!valid) return null;

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.avatar,
      };
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: providers,
  callbacks: {
    async session({ session, user }) {
      if (user) session.user.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (!url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user }) {
      const clientMongo = await clientPromise;
      const db = clientMongo.db(dbName);

      const existing = await db
        .collection(collections.users)
        .findOne({ email: user.email });

      if (!existing) {
        await db.collection(collections.users).insertOne({
          email: user.email,
          name: user.name ?? "",
          avatar: user.image,
          createdAt: new Date(),
        });
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
});
