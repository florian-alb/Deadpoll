import NextAuth from "next-auth";

import GitHub from "next-auth/providers/github";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { collections } from "@/lib/collections";
import clientPromise, { dbName } from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
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

      console.log("existing:", existing);
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
});
