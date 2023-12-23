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
  let formData: any;
  try {
    formData = await req.formData();
  } catch (error) {
    return Response.json(error);
  }

  const updateData: Record<string, string> = {};
  updateData.nickname = formData.get("nickname") as string;
  updateData.phone = formData.get("phone") as string;
  const file: any = formData.get("file");
  const isFileExists: boolean = formData.get("isFileExists");

  let email: any;
  try {
    const session = await getServerSession(authConfig);
    email = session?.user?.email;
  } catch (error) {
    return Response.json({ error, number: 1 });
  }

  mongoose.connect(process.env.MONGO_URL as string);

  try {
    const { _id } = await User.findOne({ email });
    if (_id) {
      updateData.id = _id as string;
      updateData.owner = email as string;
    } else {
      return Response.json("User not found");
    }
  } catch (error) {
    return Response.json({ error, number: 2 });
  }

  // ======================================= 1
  // const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
  // const uploadPreset = "YOUR_UPLOAD_PRESET";// ???
  // const cloudinaryApiKey = CLOUDINARY_API_KEY;
  // const cloudinaryApiSecret = CLOUDINARY_API_SECRET;

  // const fd = new FormData();
  // fd.append("file", file);
  // fd.append("upload_preset", uploadPreset);

  // fetch(cloudinaryUrl, {
  //   method: "POST",
  //   body: fd,
  //   headers: {
  //     Authorization: `Basic ${btoa(
  //       `${cloudinaryApiKey}:${cloudinaryApiSecret}`
  //     )}`,
  //   },
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log("File uploaded successfully:", data);
  //   })
  //   .catch((error) => {
  //     console.error("Error uploading file to Cloudinary:", error);
  //   });

  // ========================================= 2

  if (isFileExists) {
    const obj: any = {};

    try {
      obj.arrayBuffer_ = await file.arrayBuffer();
    } catch (error) {
      return Response.json({ error, number: 3 });
    }

    const imageBuffer = Buffer.from(obj.arrayBuffer_);

    try {
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

      updateData.portrait = result?.secure_url;
      delete updateData.id;
    } catch (error) {
      return Response.json({ error, number: 4 });
    }
  }

  // ============================================== 3

  if (Object.keys(updateData).length > 0) {
    let isUserInfoExists;
    try {
      isUserInfoExists = await UserInfo.findOne({
        owner: updateData.owner,
      });
    } catch (error) {
      return Response.json({ error, number: 5 });
    }

    try {
      const user = await User.findOne({ email });

      if (isUserInfoExists) {
        const userInfo = await UserInfo.findOneAndUpdate(
          { owner: updateData.owner },
          { ...updateData },
          { new: true }
        );

        return Response.json({ ...userInfo._doc, ...updateData, ...user._doc });
      } else {
        const userInfo = await UserInfo.create({ ...updateData });

        return Response.json({ ...userInfo._doc, ...updateData, ...user._doc });
      }
    } catch (error) {
      return Response.json({ error, number: 6 });
    }
  }

  return Response.json(null);
}
