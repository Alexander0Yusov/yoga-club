import { Feedback } from "@/mongoose/models/Feedback";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";
import { z } from "zod";

import { getCurrentAuthUser } from "@/shared/auth/mock-auth";

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

const updateFeedbackSchema = z.object({
  _id: z.string().min(1),
  comment: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

// GET ALL MY FBCKS
export async function GET() {
  const email = getCurrentAuthUser()?.email;

  if (!email) {
    return Response.json([]);
  }

  await connectToDatabase();

  const user = await User.findOne({ email }).lean<{ _id: string }>();
  if (!user) {
    return Response.json([]);
  }

  const feedbacks = await Feedback.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

  return Response.json(feedbacks);
}

// PATCH
export async function PATCH(req: Request) {
  await connectToDatabase();

  const payload = updateFeedbackSchema.parse(await req.json());
  const updatedFeedback = await Feedback.findOneAndUpdate(
    { _id: payload._id },
    {
      comment: payload.comment || payload.text,
      rating: payload.rating,
    },
    { new: true }
  ).lean();

  return Response.json(updatedFeedback);
}
