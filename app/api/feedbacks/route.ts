import { authConfig } from "@/configs/auth";
import { Feedback } from "@/mongoose/models/Feedback";
import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

// POST
export async function POST(req: Request) {
  let email: any;
  try {
    const session = await getServerSession(authConfig);
    email = session?.user?.email;
  } catch (error) {
    return Response.json({ error, number: 1 });
  }

  await connectToDatabase();

  const { _id } = await User.findOne({ email });

  let { text } = await req.json();

  const { _id: id } = await UserInfo.findOne({ userEmail: email });

  const newFeedback: any = await Feedback.create({
    userId: _id,
    userInfoId: id,
    text,
  });
  return Response.json({ ...newFeedback._doc });

  // }
}

// GET ALL
export async function GET() {
  await connectToDatabase();

  const feedbacks: any = await Feedback.find()
    .populate({
      path: "userId",
      model: "User",
      select: "name image",
    })
    .populate({
      path: "userInfoId",
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

// DELETE
export async function DELETE(req: Request) {
  // проверить не сможет ли посторонний удалить сделав запрос

  let { _id } = await req.json();

  await connectToDatabase();

  const deletedFeedback: any = await Feedback.findOneAndDelete({ _id });

  return Response.json({ ...deletedFeedback._doc });
}
