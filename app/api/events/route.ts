import { Events } from "@/mongoose/models/Events";
import mongoose from "mongoose";
import { z } from "zod";

import { getCurrentAuthUser } from "@/shared/auth/mock-auth";

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URL as string);
  }
};

const eventActionSchema = z.discriminatedUnion("action", [
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

const eventUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  timeTarget: z.string().trim().optional(),
  endTimeTarget: z.string().trim().optional(),
  date: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  location: z.string().trim().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  imageUrl: z.string().trim().optional(),
  instagramUrl: z.string().trim().optional(),
  isFeatured: z.boolean().optional(),
  landingIndex: z.number().int().optional(),
  isActive: z.boolean().optional(),
  deletedAt: z.union([z.string().datetime({ offset: true }), z.null()]).optional(),
  picsArray: z
    .array(
      z.object({
        value: z.string().min(1),
        alt: z.string().trim().optional().default(""),
      })
    )
    .optional(),
  defaultImg: z.number().int().optional(),
});

type EventRecord = Record<string, unknown> & { _id?: unknown };

function serializeEvent(event: EventRecord) {
  return {
    ...event,
    _id: String(event._id ?? ""),
  };
}

async function getRequestRole() {
  const user = getCurrentAuthUser();

  if (!user) {
    return "USER" as const;
  }

  return user.viewMode || user.role || "USER";
}

function getRequestedViewMode(req?: Request) {
  const viewMode = req ? new URL(req.url).searchParams.get("viewMode") : null;

  if (viewMode === "USER" || viewMode === "ADMIN" || viewMode === "SUPERADMIN") {
    return viewMode;
  }

  return null;
}

function shouldShowTrash(req?: Request) {
  if (!req) {
    return false;
  }

  const showTrash = new URL(req.url).searchParams.get("showTrash");

  return showTrash === "true" || showTrash === "1";
}

function resolveEffectiveRole(params: {
  sessionRole: "USER" | "ADMIN" | "SUPERADMIN";
  requestedViewMode: "USER" | "ADMIN" | "SUPERADMIN" | null;
}) {
  return params.requestedViewMode || params.sessionRole;
}

function isAuthorized(user: { email?: string | null; role: string }) {
  return user.role === "ADMIN" || user.role === "SUPERADMIN";
}

function getVisibleFilter(role: "USER" | "ADMIN" | "SUPERADMIN", showTrash: boolean) {
  if (role === "USER") {
    return {
      deletedAt: null,
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };
  }

  if (showTrash) {
    return {};
  }

  return { deletedAt: null };
}

function normalizeEventPayload(payload: Record<string, unknown>) {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";

  return {
    slug: typeof payload.slug === "string" ? payload.slug.trim() : "",
    title,
    description,
    date:
      typeof payload.date === "string" && payload.date
        ? new Date(payload.date)
        : payload.timeTarget && typeof payload.timeTarget === "string"
          ? new Date(payload.timeTarget)
          : new Date(),
    location: typeof payload.location === "string" ? payload.location.trim() : "",
    price: payload.price ?? "",
    imageUrl:
      typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "",
    instagramUrl:
      typeof payload.instagramUrl === "string" ? payload.instagramUrl.trim() : "",
    isFeatured: Boolean(payload.isFeatured),
    landingIndex:
      typeof payload.landingIndex === "number"
        ? payload.landingIndex
        : Number(payload.landingIndex ?? 0),
    isActive: payload.isActive !== false,
    deletedAt: null as Date | null,
    timeTarget:
      typeof payload.timeTarget === "string" ? payload.timeTarget.trim() : "",
    endTimeTarget:
      typeof payload.endTimeTarget === "string" ? payload.endTimeTarget.trim() : "",
    picsArray: Array.isArray(payload.picsArray)
      ? payload.picsArray.map((item) => ({
          value:
            item && typeof item === "object" && "value" in item && typeof item.value === "string"
              ? item.value
              : "",
          alt:
            item && typeof item === "object" && "alt" in item && typeof item.alt === "string"
              ? item.alt
              : "",
        }))
      : [],
    defaultImg:
      typeof payload.defaultImg === "number"
        ? payload.defaultImg
        : Number(payload.defaultImg ?? 0),
  };
}

function normalizeSlug(value?: string | null) {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// POST
export async function POST(req: Request) {
  await connectToDatabase();

  const currentUser = getCurrentAuthUser();
  const email = currentUser?.email;

  if (!email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = normalizeEventPayload((await req.json()) as Record<string, unknown>);
  const slug = normalizeSlug(payload.slug || payload.title || "event");

  const event = await Events.create({
    ...payload,
    slug,
    isActive: true,
    deletedAt: null,
  });

  return Response.json(serializeEvent(event.toObject() as EventRecord));
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
  });
  const showTrash = effectiveRole === "SUPERADMIN" && shouldShowTrash(req);

  const filter = getVisibleFilter(effectiveRole, showTrash);

  const events = await Events.find(filter)
    .sort({ isFeatured: -1, landingIndex: 1, createdAt: -1 })
    .lean();

  return Response.json(events.map((event) => serializeEvent(event as EventRecord)));
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
  });
  const body = (await req.json()) as Record<string, unknown>;
  const isLifecycleAction = typeof body.action === "string";

  if (isLifecycleAction) {
    const payload = eventActionSchema.parse(body);

    if (
      (payload.action === "toggleVisibility" ||
        payload.action === "softDelete" ||
        payload.action === "restore") &&
      !isAuthorized({ email, role: effectiveRole })
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (payload.action === "hardDelete" && effectiveRole !== "SUPERADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (payload.action === "hardDelete") {
      const deleted = await Events.findOneAndDelete({ _id: payload._id }).lean();
      return Response.json(deleted ? serializeEvent(deleted as EventRecord) : null);
    }

    const event = await Events.findById(payload._id);

    if (!event) {
      return Response.json(null);
    }

    if (payload.action === "toggleVisibility") {
      event.isActive = payload.isActive;
      if (payload.isActive) {
        event.deletedAt = null;
      }
    } else if (payload.action === "softDelete") {
      event.isActive = false;
      event.deletedAt = payload.deletedAt ? new Date(payload.deletedAt) : new Date();
    } else {
      event.isActive = true;
      event.deletedAt = null;
    }

    await event.save();

    return Response.json(serializeEvent(event.toObject() as EventRecord));
  }

  const payload = eventUpdateSchema.parse(body);
  const event = await Events.findById(payload.id);

  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  if (payload.title !== undefined) event.title = payload.title;
  if (payload.description !== undefined) event.description = payload.description;
  if (payload.timeTarget !== undefined) event.timeTarget = payload.timeTarget;
  if (payload.endTimeTarget !== undefined) event.endTimeTarget = payload.endTimeTarget;
  if (payload.date !== undefined) event.date = new Date(payload.date);
  if (payload.slug !== undefined) event.slug = normalizeSlug(payload.slug);
  if (payload.location !== undefined) event.location = payload.location;
  if (payload.price !== undefined) event.price = payload.price;
  if (payload.imageUrl !== undefined) event.imageUrl = payload.imageUrl;
  if (payload.instagramUrl !== undefined) event.instagramUrl = payload.instagramUrl;
  if (payload.isFeatured !== undefined) event.isFeatured = payload.isFeatured;
  if (payload.landingIndex !== undefined) event.landingIndex = payload.landingIndex;
  if (payload.isActive !== undefined) event.isActive = payload.isActive;
  if (payload.deletedAt !== undefined) {
    event.deletedAt = payload.deletedAt ? new Date(payload.deletedAt) : null;
  }
  if (payload.picsArray !== undefined) {
    event.picsArray = payload.picsArray;
  }
  if (payload.defaultImg !== undefined) event.defaultImg = payload.defaultImg;

  await event.save();

  return Response.json(serializeEvent(event.toObject() as EventRecord));
}

export async function DELETE(req: Request) {
  await connectToDatabase();

  const currentUser = getCurrentAuthUser();
  const email = currentUser?.email;
  const body = (await req.json()) as { _id?: string };

  if (currentUser?.role !== "SUPERADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const deleted = await Events.findOneAndDelete({ _id: body._id || "" }).lean();
  return Response.json(deleted ? serializeEvent(deleted as EventRecord) : null);
}
