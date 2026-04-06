import { NextRequest } from "next/server";

import {
  buildContentBackendHeaders,
  CONTENT_BACKEND_BASE_URL,
  proxyResponse,
} from "@/shared/api/content-backend-proxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  params: {
    id: string;
  };
};

async function forwardHeroIntroRequest(
  req: NextRequest,
  id: string,
  method: "PUT"
) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    const response = await fetch(
      `${CONTENT_BACKEND_BASE_URL}/hero-intro/${id}`,
      {
        method,
        headers: buildContentBackendHeaders(req),
        body: formData,
      }
    );

    return proxyResponse(response);
  }

  const body = await req.json();
  const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/hero-intro/${id}`, {
    method,
    headers: {
      ...Object.fromEntries(buildContentBackendHeaders(req).entries()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return proxyResponse(response);
}

export async function PUT(req: NextRequest, { params }: Params) {
  return forwardHeroIntroRequest(req, params.id, "PUT");
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const response = await fetch(
    `${CONTENT_BACKEND_BASE_URL}/hero-intro/${params.id}`,
    {
      method: "DELETE",
      headers: buildContentBackendHeaders(req),
    }
  );

  return proxyResponse(response);
}
