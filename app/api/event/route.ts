import { Events } from "@/mongoose/models/Events";
import mongoose from "mongoose";

const { MONGO_URL } = process.env;

// GET
export async function GET(req: Request) {
  mongoose.connect(MONGO_URL as string);

  const event: any = await Events.findById(req);

  if (event) {
    return Response.json(event);
  }

  return Response.json(null);
}
