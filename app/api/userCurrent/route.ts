import { authConfig } from "@/configs/auth";
import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

const { MONGO_URL, admins } = process.env;

type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

function isSuperAdminByEmail(email: string): boolean {
  return admins?.split("|").includes(email) ?? false;
}

function toRoleByEmail(email: string): UserRole {
  return isSuperAdminByEmail(email) ? "SUPERADMIN" : "USER";
}

function toIsAdminByRole(role: UserRole): boolean {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export async function GET() {
  mongoose.connect(MONGO_URL as string);

  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  if (!email) {
    return Response.json(null);
  }

  const sessionData = await User.findOne({ email });
  if (!sessionData) {
    return Response.json(null);
  }

  const forcedRole = toRoleByEmail(email);
  const shouldBeAdmin = toIsAdminByRole(forcedRole);

  let userInfo = await UserInfo.findOne({ userEmail: email });

  if (!userInfo) {
    userInfo = await UserInfo.create({
      userId: sessionData._doc._id,
      userEmail: email,
      role: forcedRole,
      viewMode: forcedRole,
      isAdmin: shouldBeAdmin,
    });
  } else if (forcedRole === "SUPERADMIN" && userInfo.role !== "SUPERADMIN") {
    userInfo = await UserInfo.findOneAndUpdate(
      { userEmail: email },
      {
        role: "SUPERADMIN",
        viewMode: "SUPERADMIN",
        isAdmin: true,
      },
      { new: true }
    );
  }

  const result = { ...userInfo?._doc, ...sessionData._doc };

  delete result._id;
  delete result.userEmail;
  delete result.userId;
  delete result.emailVerified;
  delete result.updatedAt;

  return Response.json(result);
}
