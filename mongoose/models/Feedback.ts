import mongoose, { Schema, models, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    authorName: { type: String, default: "" },
    comment: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    date: { type: Date, default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Feedback = models?.Feedback || model("Feedback", feedbackSchema);
