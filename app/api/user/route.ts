import { authConfig } from "@/configs/auth";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { v2 as cloudinary } from "cloudinary";
import { UserInfo } from "@/mongoose/models/UserInfo";

// GET
// export async function GET(email: any) {
//   mongoose.connect(process.env.MONGO_URL as string);

//   if (email) {
//     const sessionData = User.findOne({ email });
//     const userInfoData = UserInfo.findOne({ owner: email });

//     const [session, userInfo] = await Promise.all([sessionData, userInfoData]);

//     return Response.json({ session, userInfo });
//   } else {
//     return Response.json(null);
//   }
// }

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

  const nickname = formData.get("name");
  const phone = formData.get("phone");
  const portrait: any = formData.get("file");

  const updateData: Record<string, string> = {};

  const session = await getServerSession(authConfig);
  const email = session?.user?.email;

  // if (nickname || phone || portrait) {
  const { _id } = await User.findOne({ email });
  if (_id) {
    updateData.id = _id as string;
    updateData.owner = email as string;
  } else {
    return Response.json(null);
  }
  // }

  // if (nickname) {
  updateData.nickname = nickname as string;
  // }
  // if (phone) {
  updateData.phone = phone as string;
  // }

  if (portrait && portrait !== "no change") {
    const imageArrayBuf = await portrait.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuf, "base64");

    const result: any = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "yoga-club/avatars",
            resource_type: "image",
            use_filename: true,
            public_id: updateData.id,
            overwrite: true,
          },
          (error, uploadResult) => {
            if (error) {
              throw error;
            }
            return resolve(uploadResult);
          }
        )
        .end(imageBuffer);
    });

    delete updateData.id;
    updateData.portrait = result?.secure_url;
  } else if (portrait !== "no change") {
    updateData.portrait = "";
  }

  if (Object.keys(updateData).length > 0) {
    const isUserInfoExists = await UserInfo.findOne({
      owner: updateData.owner,
    });

    if (isUserInfoExists) {
      const userInfo = await UserInfo.findOneAndUpdate({ ...updateData });
      const user = await User.findOne({ email });

      return Response.json({
        userInfo: { ...userInfo._doc, ...updateData, ...user._doc },
      });
    } else {
      const userInfo = await UserInfo.create({ ...updateData });
      return Response.json(userInfo);
    }
  }

  return Response.json(null);
}
