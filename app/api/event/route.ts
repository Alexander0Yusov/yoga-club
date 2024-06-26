import { Events } from "@/mongoose/models/Events";
import mongoose from "mongoose";
// import { NextApiRequest, NextApiResponse } from "next";

const { MONGO_URL } = process.env;

// GET
export async function GET(id: any) {
  if (!id) {
    return Response.json({ error: "Missing id parameter" });
  }
  mongoose.connect(MONGO_URL as string);

  try {
    const event: any = await Events.findById(id);

    if (event) {
      return Response.json(event);
    }

    return Response.json({ error: "Event not found" });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" });
  }
}

// PATCH
export async function PATCH(req: Request) {
  const { id, ...updateData } = await req.json();

  if (!id) {
    return Response.json({ error: "Missing id parameter" });
  }
  mongoose.connect(MONGO_URL as string);

  try {
    const event: any = await Events.findByIdAndUpdate(id, { ...updateData });

    if (event) {
      return Response.json(event);
    }

    return Response.json({ error: "Event not found" });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" });
  }
}

// DELETE
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return Response.json({ error: "Missing id parameter" });
  }
  mongoose.connect(MONGO_URL as string);

  try {
    const event: any = await Events.findByIdAndDelete(id);

    if (event) {
      return Response.json(event);
    }

    return Response.json({ error: "Event not found" });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" });
  }
}
