import { Events } from "@/mongoose/models/Events";
import { User } from "@/mongoose/models/User";
import mongoose from "mongoose";

const { MONGO_URL, admins } = process.env;

// POST
export async function POST(req: Request) {
  const { email, ...restProps } = await req.json();

  mongoose.connect(MONGO_URL as string);

  const user: any = await User.findOne({ email });

  if (user && admins?.split("|").includes(email)) {
    const event: any = await Events.create(restProps);

    return Response.json({ event });
  }

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
