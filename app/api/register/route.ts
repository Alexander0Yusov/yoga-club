import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";

export async function POST(req: any) {
  const body = await req.json();
  mongoose.connect(process.env.MONGO_URL as string);
  const user: any = await User.create(body);
  return Response.json(user);
}
