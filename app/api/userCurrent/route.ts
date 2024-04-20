import { authConfig } from "@/configs/auth";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { UserInfo } from "@/mongoose/models/UserInfo";

// GET
export async function GET() {
  mongoose.connect(process.env.MONGO_URL as string);

  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  if (email) {
    const isUserInfoExists = await UserInfo.findOne({ userEmail: email });

    if (isUserInfoExists) {
      // это можно через популейт выполнить, изменив формат ответа
      const sessionDataPromise: any = User.findOne({ email });
      const userInfoDataPromise = UserInfo.findOne({ userEmail: email });

      const [sessionData, userInfoData] = await Promise.all([
        sessionDataPromise,
        userInfoDataPromise,
      ]);

      const result = { ...userInfoData._doc, ...sessionData._doc };

      delete result._id;
      delete result.userEmail;
      delete result.userId;
      delete result.emailVerified;
      delete result.updatedAt;

      return Response.json(result);
    } else {
      const sessionData = await User.findOne({ email });

      const userInfoData = await UserInfo.create({
        userId: sessionData._doc._id,
        userEmail: email,
      });

      const result = { ...userInfoData._doc, ...sessionData._doc };

      delete result._id;
      delete result.userEmail;
      delete result.userId;
      delete result.emailVerified;
      delete result.updatedAt;

      return Response.json(result);
    }
  } else {
    return Response.json(null);
  }

  // if (email) {
  //   const isUserInfoExists = await UserInfo.findOne({ owner: email });

  //   if (isUserInfoExists) {
  //     const sessionDataPromise = User.findOne({ email });
  //     const userInfoDataPromise = UserInfo.findOne({ owner: email });

  //     const [sessionData, userInfoData] = await Promise.all([
  //       sessionDataPromise,
  //       userInfoDataPromise,
  //     ]);

  //     return Response.json({ ...userInfoData._doc, ...sessionData._doc });
  //   } else {
  //     const sessionData = await User.findOne({ email });

  //     return Response.json({ ...sessionData._doc });
  //   }
  // } else {
  //   return Response.json(null);
  // }
}
