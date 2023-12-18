import { authConfig } from "@/configs/auth";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const body = await req.json();
  mongoose.connect(process.env.MONGO_URL as string);
  const user: any = await User.create(body);
  return Response.json(user);
}

export async function PATCH(req: Request) {
  const formData = await req.formData();
  mongoose.connect(process.env.MONGO_URL as string);

  const name = formData.get("name");
  const image = formData.get("image");

  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  const updateData: Record<string, string> = {};
  if (name) {
    updateData.name = name as string;
  }
  if (image) {
    updateData.image = "image";
  }

  if (Object.keys(updateData).length > 0) {
    const user: any = await User.updateOne({ email }, updateData);

    return Response.json(user);
  }

  return Response.json(null);
}
