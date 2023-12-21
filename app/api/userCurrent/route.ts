import { authConfig } from "@/configs/auth";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { UserInfo } from "@/mongoose/models/UserInfo";

// GET
export async function GET(req: Request) {
  mongoose.connect(process.env.MONGO_URL as string);

  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  if (email) {
    const isUserInfoExists = await UserInfo.findOne({ owner: email });

    if (isUserInfoExists) {
      const sessionData = User.findOne({ email });
      const userInfoData = UserInfo.findOne({ owner: email });

      const [session, userInfo] = await Promise.all([
        sessionData,
        userInfoData,
      ]);

      return Response.json({ ...userInfo._doc, ...session._doc });
    } else {
      const sessionData = await User.findOne({ email });

      return Response.json({ ...sessionData._doc });
    }
  } else {
    return Response.json(null);
  }
}
