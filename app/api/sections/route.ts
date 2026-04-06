import { NextRequest } from "next/server";

import {
  buildContentBackendHeaders,
  CONTENT_BACKEND_BASE_URL,
  proxyResponse,
} from "@/shared/api/content-backend-proxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/sections`, {
    method: "GET",
    headers: buildContentBackendHeaders(req),
  });

  return proxyResponse(response);
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/sections`, {
    method: "POST",
    headers: {
      ...Object.fromEntries(buildContentBackendHeaders(req).entries()),
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(response);
}
