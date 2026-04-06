import { NextResponse } from "next/server";

import {
  authCredentialsSchema,
  getCurrentAuthUser,
  registerMockUser,
  setAuthCookie,
  updateMockUser,
} from "@/shared/auth/mock-auth";

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";
  const base64 = buffer.toString("base64");

  return `data:${mimeType};base64,${base64}`;
}

export async function POST(req: Request) {
  let body;

  try {
    body = authCredentialsSchema.omit({ rememberMe: true }).parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid registration payload" } },
      { status: 400 },
    );
  }

  try {
    const user = registerMockUser({
      email: body.email,
      password: body.password,
    });

    const response = NextResponse.json(user, { status: 201 });
    setAuthCookie(response, body.email, true);

    return response;
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    const message =
      status === 409
        ? "Account already exists"
        : "Unable to create account";

    return NextResponse.json({ error: { message } }, { status });
  }
}

export async function PATCH(req: Request) {
  const currentUser = getCurrentAuthUser();

  if (!currentUser) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: { message: "Invalid form data" } }, { status: 400 });
  }

  const nickname = String(formData.get("nickname") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const isSubscribedValue = String(formData.get("isSubscribed") || "false");
  const file = formData.get("file");
  const portrait =
    file instanceof File && file.size > 0 ? await fileToDataUrl(file) : undefined;

  const updatedUser = updateMockUser(currentUser.email, {
    nickname: nickname || currentUser.nickname,
    name: nickname || currentUser.name,
    telephone: phone,
    isSubscribed: isSubscribedValue === "true",
    portrait: portrait ?? currentUser.portrait,
    image: portrait ?? currentUser.image,
  });

  if (!updatedUser) {
    return NextResponse.json({ error: { message: "User not found" } }, { status: 404 });
  }

  return NextResponse.json(updatedUser);
}
