import { Events } from "@/mongoose/models/Events";
import { events_lib } from "@/lib/dataEvents";
import mongoose from "mongoose";

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

const imageUrl = (index: number) => {
  const image = events_lib[index % events_lib.length].value as { src?: string } | string;
  return typeof image === "string" ? image : image.src || "";
};

const mocks = [
  {
    title: "Morning Flow Practice",
    description: "A calm beginner-friendly flow session for an easy start.",
    date: new Date("2026-04-10T08:00:00.000Z"),
    isActive: true,
    deletedAt: null,
  },
  {
    title: "Breath & Balance",
    description: "Focus on breathing patterns and posture alignment.",
    date: new Date("2026-04-14T09:30:00.000Z"),
    isActive: true,
    deletedAt: null,
  },
  {
    title: "Weekend Restore",
    description: "Gentle weekend recovery session with soft transitions.",
    date: new Date("2026-04-18T10:00:00.000Z"),
    isActive: true,
    deletedAt: null,
  },
  {
    title: "Core Stability Lab",
    description: "Hidden event used to test moderation visibility.",
    date: new Date("2026-04-22T11:00:00.000Z"),
    isActive: false,
    deletedAt: null,
  },
  {
    title: "Stretch & Release",
    description: "Hidden event for admin-only curation.",
    date: new Date("2026-04-26T12:00:00.000Z"),
    isActive: false,
    deletedAt: null,
  },
  {
    title: "Evening Reset",
    description: "Hidden review of the evening class flow.",
    date: new Date("2026-04-30T18:30:00.000Z"),
    isActive: false,
    deletedAt: null,
  },
  {
    title: "Legacy Archive Session",
    description: "Legacy item without active lifecycle flags.",
    date: new Date("2026-03-15T17:00:00.000Z"),
  },
  {
    title: "Trashed Alignment Workshop",
    description: "Trashed record for delete/restore testing.",
    date: new Date("2026-03-12T09:00:00.000Z"),
    isActive: false,
    deletedAt: new Date("2026-03-21T10:00:00.000Z"),
  },
  {
    title: "Trashed Flow Session",
    description: "Another trashed event for admin QA.",
    date: new Date("2026-03-10T13:00:00.000Z"),
    isActive: false,
    deletedAt: new Date("2026-03-21T11:00:00.000Z"),
  },
  {
    title: "Trashed Breath Clinic",
    description: "Final trashed mock for the lifecycle matrix.",
    date: new Date("2026-03-08T15:00:00.000Z"),
    isActive: false,
    deletedAt: new Date("2026-03-21T12:00:00.000Z"),
  },
];

export async function POST() {
  await connectToDatabase();

  await Events.deleteMany({});

  const inserted = await Events.insertMany(
    mocks.map((item, index) => ({
      slug: item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      title: item.title,
      description: item.description,
      date: item.date,
      location: "Yoga Club Studio",
      price: "Free",
      imageUrl: imageUrl(index),
      isFeatured: index < 2,
      landingIndex: index,
      isActive: item.isActive !== false,
      deletedAt: item.deletedAt || null,
      picsArray: [{ value: imageUrl(index) }],
      defaultImg: index % events_lib.length,
      timeTarget: item.date.toISOString().slice(0, 10),
    }))
  );

  return Response.json({
    inserted: inserted.length,
    distribution: {
      active: 3,
      hidden: 3,
      trashed: 3,
      legacy: 1,
    },
  });
}
