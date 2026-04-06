import {
  getMockUsers,
  getCurrentAuthUser,
  userViewModeSchema,
  updateMockUser,
  updateMockUserById,
} from "@/shared/auth/mock-auth";

export async function GET() {
  return Response.json(getMockUsers());
}

export async function PATCH(req: Request) {
  const payload = await req.json();
  const parsed = userViewModeSchema.safeParse(payload);

  if (parsed.success) {
    const { userEmail, userId, viewMode } = parsed.data;

    if (!userEmail && !userId) {
      return Response.json(
        { error: "userEmail or userId is required" },
        { status: 400 },
      );
    }

    const updatedUser = userEmail
      ? updateMockUser(userEmail, {
          role: viewMode,
          originalRole: viewMode,
          viewMode,
          isAdmin: viewMode === "ADMIN" || viewMode === "SUPERADMIN",
        })
      : updateMockUserById(userId || "", {
          role: viewMode,
          originalRole: viewMode,
          viewMode,
          isAdmin: viewMode === "ADMIN" || viewMode === "SUPERADMIN",
        });

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      userId: userId || updatedUser.id,
      userEmail: updatedUser.email,
      viewMode: updatedUser.viewMode,
      isAdmin: updatedUser.isAdmin,
    });
  }

  const body = payload as { userEmail?: string; isInBlacklist?: boolean };

  if (body.userEmail && typeof body.isInBlacklist === "boolean") {
    const currentUser = getCurrentAuthUser();
    const updatedUser = updateMockUser(body.userEmail, {
      isInBlacklist: body.isInBlacklist,
    });

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      userEmail: updatedUser.email,
      isInBlacklist: updatedUser.isInBlacklist,
      requestedBy: currentUser?.email || null,
    });
  }

  return Response.json(
    { error: "Invalid payload for usersAll PATCH" },
    { status: 400 },
  );
}
