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
  const payload = (await req.json()) as {
    userEmail?: string;
    isInBlacklist?: boolean;
    userId?: string;
    viewMode?: "USER" | "ADMIN" | "SUPERADMIN";
  };

  mongoose.connect(process.env.MONGO_URL as string);

  if ((payload.userId || payload.userEmail) && payload.viewMode) {
    const isAdmin =
      payload.viewMode === "ADMIN" || payload.viewMode === "SUPERADMIN";
    const query = payload.userId
      ? { userId: payload.userId }
      : { userEmail: payload.userEmail };

    const updated = await UserInfo.findOneAndUpdate(
      query,
      { isAdmin, role: payload.viewMode, viewMode: payload.viewMode },
      { new: true }
    );

    return Response.json({
      userId: payload.userId,
      userEmail: payload.userEmail,
      viewMode: payload.viewMode,
      isAdmin: updated?.isAdmin ?? isAdmin,
    });
  }

  if (payload.userEmail && typeof payload.isInBlacklist === "boolean") {
    const updated = await UserInfo.findOneAndUpdate(
      { userEmail: payload.userEmail },
      { isInBlacklist: payload.isInBlacklist },
      { new: true }
    );

    return Response.json({
      userEmail: payload.userEmail,
      isInBlacklist: updated?.isInBlacklist ?? payload.isInBlacklist,
    });
  }

  return Response.json(
    { error: "Invalid payload for usersAll PATCH" },
    { status: 400 }
  );
}
