import { Schema, models, model } from "mongoose";

const eventsSchema = new Schema(
  {
    email: { type: String },
    timeTarget: { type: String },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
  },
  { timestamps: true }
);

export const Events = models?.Events || model("Events", eventsSchema);
