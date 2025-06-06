import NextAuth from "next-auth";

import GitHub from "next-auth/providers/github";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

import client from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
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
});
