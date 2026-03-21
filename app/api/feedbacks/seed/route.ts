import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";
import { Feedback } from "@/mongoose/models/Feedback";
import mongoose from "mongoose";

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

export async function POST() {
  await connectToDatabase();

  const profile = await UserInfo.findOne({ userEmail: "yusovsky2@gmail.com" }).lean<{
    nickname?: string;
    portrait?: string;
  }>();
  const user = await User.findOne({ email: "yusovsky2@gmail.com" }).lean<{
    image?: string;
  }>();
  const personalAvatar = profile?.portrait || user?.image || "";
  const personalName = profile?.nickname || "Yusovsky";

  const mockFeedbacks = [
    {
      authorName: personalName,
      avatarUrl: personalAvatar,
      comment: "My first real review keeps the landing slider visually grounded.",
      rating: 5,
      isActive: true,
      deletedAt: null,
    },
    {
      authorName: personalName,
      avatarUrl: personalAvatar,
      comment: "My second real review verifies the admin panel and slider stay in sync.",
      rating: 5,
      isActive: true,
      deletedAt: null,
    },
    {
      authorName: "Vika",
      avatarUrl: "",
      comment: "Public review for slider coverage.",
      rating: 5,
      isActive: true,
      deletedAt: null,
    },
    {
      authorName: "Nadia",
      avatarUrl: "",
      comment: "Hidden review for moderation flow testing.",
      rating: 3,
      isActive: false,
      deletedAt: null,
    },
    {
      authorName: "Katya",
      avatarUrl: "",
      comment: "Another hidden item for admin review queues.",
      rating: 4,
      isActive: false,
      deletedAt: null,
    },
    {
      authorName: "Olena",
      avatarUrl: "",
      comment: "Third hidden review to cover the moderation table state.",
      rating: 4,
      isActive: false,
      deletedAt: null,
    },
    {
      authorName: "Oksana",
      avatarUrl: "",
      comment: "Soft-deleted review used to verify trash/restore behavior.",
      rating: 2,
      isActive: false,
      deletedAt: new Date("2026-03-21T10:00:00.000Z"),
    },
    {
      authorName: "Serhii",
      avatarUrl: "",
      comment: "Trashed feedback to validate restore actions.",
      rating: 1,
      isActive: false,
      deletedAt: new Date("2026-03-21T11:00:00.000Z"),
    },
    {
      authorName: "Mila",
      avatarUrl: "",
      comment: "Another trashed review for show trash validation.",
      rating: 4,
      isActive: false,
      deletedAt: new Date("2026-03-21T12:00:00.000Z"),
    },
    {
      authorName: "Anna",
      avatarUrl: "",
      comment: "Legacy item that should fall back to defaults.",
      rating: 4,
    },
  ];

  await Feedback.deleteMany({});
  const inserted = await Feedback.insertMany(
    mockFeedbacks.map((item) => ({
      ...item,
      date: new Date().toISOString(),
    }))
  );

  return Response.json({
    inserted: inserted.length,
  });
}
