import mongoose, { Schema, models, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
    },
    text: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Feedback = models?.Feedback || model("Feedback", feedbackSchema);
