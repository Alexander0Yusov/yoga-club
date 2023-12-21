import mongoose from "mongoose";
import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";

// GET
export async function GET() {
  mongoose.connect(process.env.MONGO_URL as string);

  const sessionsData = User.find();
  const usersInfoData = UserInfo.find();

  const [sessions, usersInfo] = await Promise.all([
    sessionsData,
    usersInfoData,
  ]);

  const allUsersArray = [];

  for (let i = 0; i < sessions.length; i++) {
    const { email } = sessions[i];

    const user = usersInfo.find(({ owner }) => email === owner);

    if (user) {
      allUsersArray.push({ ...user._doc, ...sessions[i]._doc });
    } else {
      allUsersArray.push(sessions[i]._doc);
    }
  }

  return Response.json({ usersInfo: allUsersArray });
}
