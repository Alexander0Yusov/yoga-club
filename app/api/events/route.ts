import { authConfig } from "@/configs/auth";
import { Events } from "@/mongoose/models/Events";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

const { MONGO_URL, admins } = process.env;

// POST
export async function POST(req: Request) {
  //
  let email: any;
  try {
    const session = await getServerSession(authConfig);
    email = session?.user?.email;
  } catch (error) {
    return Response.json({ error, number: 1 });
  }

  // if (email && admins?.split("|").includes(email)) {
  mongoose.connect(MONGO_URL as string);
  const body = await req.json();
  const event: any = await Events.create(body);

  return Response.json(event);
  // }

  return Response.json(null);
}

// GET
export async function GET() {
  mongoose.connect(MONGO_URL as string);

  const events: any = await Events.find();

  if (events) {
    return Response.json(events);
  }

  return Response.json(null);
}
