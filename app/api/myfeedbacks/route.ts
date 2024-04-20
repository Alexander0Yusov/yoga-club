import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { Feedback } from "@/mongoose/models/Feedback";
import { User } from "@/mongoose/models/User";
import { authConfig } from "@/configs/auth";

const { MONGO_URL } = process.env;

// GET ALL MY FBCKS
export async function GET() {
  let email: any;
  try {
    const session = await getServerSession(authConfig);
    email = session?.user?.email;
  } catch (error) {
    return Response.json({ error, number: 1 });
  }

  const { _id } = await User.findOne({ email });

  mongoose.connect(MONGO_URL as string);

  const feedbacks: any = await Feedback.find({ userId: _id });

  if (feedbacks) {
    return Response.json(feedbacks);
  }

  return Response.json(null);
}

// PATCH
export async function PATCH(req: Request) {
  let { _id, text } = await req.json();

  mongoose.connect(MONGO_URL as string);

  const updatedFeedback: any = await Feedback.findOneAndUpdate(
    { _id },
    { text }
  );

  return Response.json({ ...updatedFeedback._doc });
}
