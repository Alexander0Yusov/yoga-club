import { Feedback } from "@/mongoose/models/Feedback";
import { User } from "@/mongoose/models/User";
import { UserInfo } from "@/mongoose/models/UserInfo";
import mongoose from "mongoose";
import { z } from "zod";

import { getCurrentAuthUser } from "@/shared/auth/mock-auth";

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

const createFeedbackSchema = z.object({
  authorName: z.string().trim().optional(),
  avatarUrl: z.string().trim().optional(),
  comment: z.string().trim().optional(),
  text: z.string().trim().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

const feedbackActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("toggleVisibility"),
    _id: z.string().min(1),
    isActive: z.boolean(),
  }),
  z.object({
    action: z.literal("softDelete"),
    _id: z.string().min(1),
    deletedAt: z.string().datetime({ offset: true }).optional(),
  }),
  z.object({
    action: z.literal("restore"),
    _id: z.string().min(1),
  }),
  z.object({
    action: z.literal("hardDelete"),
    _id: z.string().min(1),
  }),
]);

type FeedbackRecord = Record<string, unknown> & { _id?: unknown };

function serializeFeedback(feedback: FeedbackRecord) {
  return {
    ...feedback,
    _id: String(feedback._id ?? ""),
  };
}

async function getRequestRole() {
  const user = getCurrentAuthUser();

  if (!user) {
    return "USER" as const;
  }

  return user.viewMode || user.role || "USER";
}

function getRequestedViewMode(req: Request) {
  const viewMode = new URL(req.url).searchParams.get("viewMode");

  if (viewMode === "USER" || viewMode === "ADMIN" || viewMode === "SUPERADMIN") {
    return viewMode;
  }

  return null;
}

function resolveEffectiveRole(params: {
  sessionRole: "USER" | "ADMIN" | "SUPERADMIN";
  requestedViewMode: "USER" | "ADMIN" | "SUPERADMIN" | null;
  email?: string | null;
}) {
  if (params.requestedViewMode) {
    return params.requestedViewMode;
  }

  return params.sessionRole;
}

function isAuthorized(user: { email?: string | null; role: string }) {
  return user.role === "ADMIN" || user.role === "SUPERADMIN";
}

// POST
export async function POST(req: Request) {
  await connectToDatabase();

  const currentUser = getCurrentAuthUser();
  const email = currentUser?.email;

  if (!email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = createFeedbackSchema.parse(await req.json());
  const user = await User.findOne({ email }).lean<{
    _id: string;
    name?: string;
    email: string;
    image?: string;
  }>();
  const userInfo = await UserInfo.findOne({ userEmail: email }).lean<{
    _id?: string;
    nickname?: string;
    portrait?: string;
  }>();

  const feedback = await Feedback.create({
    authorName:
      payload.authorName ||
      userInfo?.nickname ||
      user?.name ||
      email.split("@")[0] ||
      "Guest",
    avatarUrl: payload.avatarUrl || userInfo?.portrait || user?.image || "",
    comment: payload.comment || payload.text || "",
    rating: payload.rating || 5,
    date: new Date().toISOString(),
    isActive: true,
    deletedAt: null,
    userId: user?._id,
    userInfoId: userInfo?._id,
  });

  return Response.json(serializeFeedback(feedback.toObject() as FeedbackRecord));
}

// GET
export async function GET(req: Request) {
  await connectToDatabase();

  const currentUser = getCurrentAuthUser();
  const email = currentUser?.email;
  const role = await getRequestRole();
  const requestedViewMode = getRequestedViewMode(req);
  const effectiveRole = resolveEffectiveRole({
    sessionRole: role,
    requestedViewMode,
    email,
  });
  const showTrash =
    effectiveRole === "SUPERADMIN" &&
    new URL(req.url).searchParams.get("showTrash") === "1";

  const filter =
    effectiveRole === "USER"
      ? { isActive: true, deletedAt: null }
      : showTrash
        ? {}
        : { deletedAt: null };

  const feedbacks = await Feedback.find(filter)
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  return Response.json(
    feedbacks.map((feedback) => serializeFeedback(feedback as FeedbackRecord))
  );
}

// PATCH
export async function PATCH(req: Request) {
  await connectToDatabase();

  const currentUser = getCurrentAuthUser();
  const email = currentUser?.email;
  const role = await getRequestRole();
  const requestedViewMode = getRequestedViewMode(req);
  const effectiveRole = resolveEffectiveRole({
    sessionRole: role,
    requestedViewMode,
    email,
  });
  const user = { email, role };

  const payload = feedbackActionSchema.parse(await req.json());

  if (payload.action === "hardDelete" && effectiveRole !== "SUPERADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (
    (payload.action === "toggleVisibility" ||
      payload.action === "softDelete" ||
      payload.action === "restore") &&
    !isAuthorized({ email, role: effectiveRole })
  ) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (payload.action === "hardDelete") {
    const deleted = await Feedback.findOneAndDelete({ _id: payload._id }).lean();
    return Response.json(
      deleted ? serializeFeedback(deleted as FeedbackRecord) : null
    );
  }

  const feedback = await Feedback.findById(payload._id);

  if (!feedback) {
    return Response.json(null);
  }

  if (payload.action === "toggleVisibility") {
    feedback.isActive = payload.isActive;
    if (payload.isActive) {
      feedback.deletedAt = null;
    }
  } else if (payload.action === "softDelete") {
    feedback.isActive = false;
    feedback.deletedAt = payload.deletedAt ? new Date(payload.deletedAt) : new Date();
  } else {
    feedback.isActive = true;
    feedback.deletedAt = null;
  }

  await feedback.save();

  return Response.json(
    serializeFeedback(feedback.toObject() as FeedbackRecord)
  );
}

// DELETE legacy alias for hard delete.
export async function DELETE(req: Request) {
  const body = (await req.json()) as { _id?: string };

  return PATCH(
    new Request(req.url, {
      method: "PATCH",
      headers: req.headers,
      body: JSON.stringify({
        action: "hardDelete",
        _id: body._id || "",
      }),
    })
  );
}
