import { authConfig } from "@/configs/auth";
import { Feedback } from "@/mongoose/models/Feedback";
import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

const { MONGO_URL } = process.env;

// POST
export async function POST(req: Request) {
  let email: any;
  try {
    const session = await getServerSession(authConfig);
    email = session?.user?.email;
  } catch (error) {
    return Response.json({ error, number: 1 });
  }

  const { _id } = await User.findOne({ email });

  // if (email && admins?.split("|").includes(email)) {
  mongoose.connect(MONGO_URL as string);
  const formData = await req.formData();
  const feedbackText = formData.get("feedback");

  const { _id: id } = await UserInfo.findOne({ owner: email });

  const newFeedback: any = await Feedback.create({
    owner: _id,
    ownerInfo: id,
    text: feedbackText,
  });
  return Response.json({ ...newFeedback._doc });

  // }
}

// GET ALL
export async function GET() {
  mongoose.connect(MONGO_URL as string);

  const feedbacks: any = await Feedback.find()
    .populate({
      path: "owner",
      model: "User",
      select: "name image",
    })
    .populate({
      path: "ownerInfo",
      model: "UserInfo",
      select: "nickname portrait",
    })
    .exec()
    .then((comments: any) => {
      return comments;
    })
    .catch((err: any) => {
      throw err;
    });

  if (feedbacks) {
    return Response.json(feedbacks);
  }

  return Response.json(null);
}
