import { Schema, models, model } from "mongoose";

const eventsSchema = new Schema(
  {
    title: { type: String },
    timeTarget: { type: String },
    description: { type: String },
    picsArray: [{ value: { type: String } }],
    defaultImg: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

export const Events = models?.Events || model("Events", eventsSchema);
