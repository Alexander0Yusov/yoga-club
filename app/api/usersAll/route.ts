import mongoose from "mongoose";
import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";

// GET All
export async function GET() {
  mongoose.connect(process.env.MONGO_URL as string);

  const usersPromise = User.find();
  const userInfosPromise = UserInfo.find();

  const [users, userInfos] = await Promise.all([
    usersPromise,
    userInfosPromise,
  ]);

  const allUsersArray = [];

  for (let i = 0; i < users.length; i++) {
    const { email } = users[i];

    const user = userInfos.find(({ userEmail }) => email === userEmail);

    if (user) {
      allUsersArray.push({ ...user._doc, ...users[i]._doc });
    } else {
      allUsersArray.push(users[i]._doc);
    }
  }

  return Response.json(allUsersArray);
}

// PATCH
export async function PATCH(req: Request) {
  const { userEmail, isInBlacklist: isInBlacklist_ } = await req.json();

  mongoose.connect(process.env.MONGO_URL as string);

  const { isInBlacklist }: any = await UserInfo.findOneAndUpdate(
    { userEmail },
    { isInBlacklist: isInBlacklist_ }
  );

  return Response.json({ isInBlacklist });
}
