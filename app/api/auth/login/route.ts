import { NextResponse } from "next/server";

import {
  authCredentialsSchema,
  authenticateMockUser,
  setAuthCookie,
} from "@/shared/auth/mock-auth";

export async function POST(req: Request) {
  let body;

  try {
    body = authCredentialsSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid login payload" } },
      { status: 400 },
    );
  }

  const user = authenticateMockUser({
    email: body.email,
    password: body.password,
  });

  if (!user) {
    return NextResponse.json(
      { error: { message: "Invalid email or password" } },
      { status: 401 },
    );
  }

  const response = NextResponse.json(user);
  setAuthCookie(response, body.email, body.rememberMe);

  return response;
}
