import { Feedback } from "@/mongoose/models/Feedback";
import mongoose from "mongoose";

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

const mockFeedbacks = [
  {
    authorName: "Alina",
    comment: "Warm class structure and clear pacing. The studio felt calm from the first minute.",
    rating: 5,
    isActive: true,
    deletedAt: null,
  },
  {
    authorName: "Ira",
    comment: "Booking was easy and the feedback module stayed readable on mobile.",
    rating: 4,
    isActive: true,
    deletedAt: null,
  },
  {
    authorName: "Vika",
    comment: "Public review for slider coverage.",
    rating: 5,
    isActive: true,
    deletedAt: null,
  },
  {
    authorName: "Nadia",
    comment: "Hidden review for moderation flow testing.",
    rating: 3,
    isActive: false,
    deletedAt: null,
  },
  {
    authorName: "Katya",
    comment: "Another hidden item for admin review queues.",
    rating: 4,
    isActive: false,
    deletedAt: null,
  },
  {
    authorName: "Oksana",
    comment: "Soft-deleted review used to verify trash/restore behavior.",
    rating: 2,
    isActive: false,
    deletedAt: new Date("2026-03-21T10:00:00.000Z"),
  },
  {
    authorName: "Serhii",
    comment: "Trashed feedback to validate restore actions.",
    rating: 1,
    isActive: false,
    deletedAt: new Date("2026-03-21T11:00:00.000Z"),
  },
  {
    authorName: "Mila",
    comment: "Another trashed review for show trash validation.",
    rating: 4,
    isActive: false,
    deletedAt: new Date("2026-03-21T12:00:00.000Z"),
  },
  {
    authorName: "Anna",
    comment: "Legacy item that should fall back to defaults.",
    rating: 4,
  },
];

export async function POST() {
  await connectToDatabase();
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
