import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { db } from "./db";

export const auth = betterAuth({
  // No `client` = no transactions, so it also works on a standalone local MongoDB.
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, autoSignIn: false, minPasswordLength: 6 },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [jwt(), nextCookies()],
});
