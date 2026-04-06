import { NextRequest } from "next/server";

import {
  buildContentBackendHeaders,
  CONTENT_BACKEND_BASE_URL,
  proxyResponse,
} from "@/shared/api/content-backend-proxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function forwardHeroIntroRequest(req: NextRequest, method: "POST") {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/hero-intro`, {
      method,
      headers: buildContentBackendHeaders(req),
      body: formData,
    });

    return proxyResponse(response);
  }

  const body = await req.json();
  const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/hero-intro`, {
    method,
    headers: {
      ...Object.fromEntries(buildContentBackendHeaders(req).entries()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return proxyResponse(response);
}

export async function GET(req: NextRequest) {
  const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/hero-intro`, {
    method: "GET",
    headers: buildContentBackendHeaders(req),
  });

  return proxyResponse(response);
}

export async function POST(req: NextRequest) {
  return forwardHeroIntroRequest(req, "POST");
}
