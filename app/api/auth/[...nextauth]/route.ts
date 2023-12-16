import clientPromise from "@/mongoDbAdapter/MongoDbClient";
import { User } from "@/mongoose/models/User";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { OAuthUserConfig } from "next-auth/providers/oauth";

type f = {
  clientId: OAuthUserConfig<any>;
  clientSecret: OAuthUserConfig<any>;
};

const handler = NextAuth({
  secret: process.env.SECRET_KEY,
  adapter: MongoDBAdapter(clientPromise as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as any,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as any,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as any;

        mongoose.connect(process.env.MONGO_URL as string);
        const user = await User.findOne({ email });

        if (user && user?.password === password) {
          return user;
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
