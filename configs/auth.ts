import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";

import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";
import clientPromise from "@/mongoDbAdapter/MongoDbClient";

import type { AuthOptions, User as User_for_type } from "next-auth";

const {
  NEXTAUTH_SECRET,
  MONGO_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
} = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

const authProviders = [];

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  authProviders.push(
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET) {
  authProviders.push(
    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    }),
  );
}

authProviders.push(
  CredentialsProvider({
    name: "Email / Password",
    id: "Credentials",
    credentials: {
      email: {
        label: "Email",
        type: "email",
        required: true,
        placeholder: "example@abc.com",
      },
      password: { label: "Password", type: "password", required: true },
    },

    async authorize(credentials) {
      const email = credentials?.email?.trim();
      const password = credentials?.password;

      if (!email || !password) {
        return null;
      }

      await connectToDatabase();

      const user: any = await User.findOne({ email });

      if (!user?.password) {
        return null;
      }

      let isValidPassword = false;

      if (user.password.startsWith("$2")) {
        isValidPassword = await bcrypt.compare(password, user.password);
      } else if (user.password === password) {
        isValidPassword = true;
        user.password = await bcrypt.hash(password, 10);
        await User.updateOne({ email }, { password: user.password });
      }

      if (!isValidPassword) {
        return null;
      }

      const userInfoForSession = await UserInfo.findOne({
        userEmail: user.email,
      });

      const {
        _doc: { password: _, ...restData },
      } = user;

      return {
        ...restData,
        isAdmin: Boolean(userInfoForSession?.isAdmin),
        isInBlacklist: Boolean(userInfoForSession?.isInBlacklist),
      } as User_for_type;
    },
  }),
);

export const authConfig: AuthOptions = {
  secret: NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise as any),
  providers: authProviders as AuthOptions["providers"],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        return true;
      }

      await connectToDatabase();

      const userInfo = await UserInfo.findOne({ userEmail: user.email });

      if (userInfo?.isInBlacklist) {
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (!token.email && user?.email) {
        token.email = user.email;
      }

      const email = user?.email || token.email;

      if (!email) {
        return token;
      }

      await connectToDatabase();

      const userInfo = await UserInfo.findOne({ userEmail: email });

      if (user?.id) {
        token.sub = user.id;
      }

      token.isAdmin = Boolean(userInfo?.isAdmin);
      token.isInBlacklist = Boolean(userInfo?.isInBlacklist);

      return token;
    },

    async session({ session, token, user }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id: string;
          isAdmin: boolean;
          isInBlacklist: boolean;
        };

        const email = session.user.email || user?.email || token?.email;

        sessionUser.id = token?.sub || user?.id || "";

        if (email) {
          await connectToDatabase();

          const userInfo = await UserInfo.findOne({ userEmail: email });

          sessionUser.isAdmin = Boolean(userInfo?.isAdmin);
          sessionUser.isInBlacklist = Boolean(userInfo?.isInBlacklist);
        } else {
          sessionUser.isAdmin = false;
          sessionUser.isInBlacklist = false;
        }
      }

      return session;
    },
  },
  // pages: {
  //   signIn: "/signin",
  // },
};
