import { Schema, models, model } from "mongoose";

const eventsSchema = new Schema(
  {
    slug: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    date: { type: Date, default: null },
    location: { type: String, default: "" },
    price: { type: Schema.Types.Mixed, default: "" },
    imageUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    landingIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    timeTarget: { type: String, default: "" },
    endTimeTarget: { type: String, default: "" },
    picsArray: [
      {
        value: { type: String },
        alt: { type: String, default: "" },
      },
    ],
    defaultImg: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const Events = models?.Events || model("Events", eventsSchema);
