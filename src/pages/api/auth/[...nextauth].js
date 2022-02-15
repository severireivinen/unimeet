import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";

/**Temporaty solution  */
import { firestore } from "../../../firebase/firebase";
/**------------------------- */

export default NextAuth({
  // Configure one or more authentication providers
  adapter: FirebaseAdapter(firestore),
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (account) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session(session, token, user) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    },
    async signIn(user, account, profile) {
      //const userToSearch = user;
      // In the future check if user is banned
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
