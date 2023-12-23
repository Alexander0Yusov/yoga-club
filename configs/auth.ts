// import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { User } from "@/mongoose/models/User";
import clientPromise from "@/mongoDbAdapter/MongoDbClient";

import type { AuthOptions, User as User_for_type } from "next-auth";

export const authConfig: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise as any),
  providers: [
    //   FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        // name: {
        //   label: "Name",
        //   type: "text",
        //   required: false,
        //   placeholder: "Maria",
        // },
        email: {
          label: "Email",
          type: "email",
          required: true,
          placeholder: "example@abc.com",
        },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        mongoose.connect(process.env.MONGO_URL as string);
        const user = await User.findOne({ email: credentials.email });

        if (user && user.password === credentials.password) {
          const {
            _doc: { ...restData },
          } = user;

          return restData as User_for_type;
        }

        return null;
      },
    }),
  ],
  // pages: {
  //   signIn: "/signin",
  // },
};
