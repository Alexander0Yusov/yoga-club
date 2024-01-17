import mongoose, { Schema, models, model } from "mongoose";

const userInfoSchema = new Schema(
  {
    owner: { type: String },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isAdmin: { type: Boolean, default: false },
    nickname: { type: String, default: "" },
    portrait: { type: String, default: "" },
    phone: { type: String, default: "" },
    subscribedForNews: { type: Boolean, default: false },
  },
  { versionKey: false }
);

export const UserInfo = models?.UserInfo || model("UserInfo", userInfoSchema);
