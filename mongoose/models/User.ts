import { Schema, models, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: (pass: string) => {
        if (!pass?.length || pass?.length < 5) {
          new Error("password must be at least 5 characters");
          return false;
        }
      },
    },
  },
  { timestamps: true }
);

export const User = models?.User || model("User", userSchema);