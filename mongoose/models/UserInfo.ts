import mongoose, { Schema, models, model } from "mongoose";

const userInfoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    userEmail: { type: String, unique: true },
    nickname: { type: String, default: "" },
    portrait: { type: String, default: "" },
    phone: { type: String, default: "" },
    isSubscribed: { type: Boolean, default: false },

    isAdmin: { type: Boolean, default: false },
    isInBlacklist: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

export const UserInfo = models?.UserInfo || model("UserInfo", userInfoSchema);
