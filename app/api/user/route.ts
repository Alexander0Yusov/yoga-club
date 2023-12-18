import { authConfig } from "@/configs/auth";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//const jimp = require("jimp"); //

// POST
export async function POST(req: Request) {
  const body = await req.json();
  mongoose.connect(process.env.MONGO_URL as string);
  const user: any = await User.create(body);
  return Response.json(user);
}

// PATCH
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUD_NAME } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export async function PATCH(req: Request) {
  const formData = await req.formData();
  mongoose.connect(process.env.MONGO_URL as string);

  const name = formData.get("name");
  const image: any = formData.get("image");

  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  const updateData: Record<string, string> = {};
  if (name) {
    updateData.name = name as string;
  }

  if (image) {
    const { _id } = await User.findOne({ email });

    const imageArrayBuf = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuf, "base64");

    const result: any = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "yoga-club/avatars",
            resource_type: "image",
            use_filename: true,
            public_id: _id,
            overwrite: true,
          },
          (error, uploadResult) => {
            return resolve(uploadResult);
          }
        )
        .end(imageBuffer);
    });

    updateData.image = result?.secure_url;
  }

  if (Object.keys(updateData).length > 0) {
    const user: any = await User.updateOne({ email }, updateData);

    return Response.json(user);
  }

  return Response.json(null);
}
