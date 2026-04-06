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

export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.text();

  const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/sections/${params.id}`, {
    method: "PUT",
    headers: {
      ...Object.fromEntries(buildContentBackendHeaders(req).entries()),
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyResponse(response);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const response = await fetch(`${CONTENT_BACKEND_BASE_URL}/sections/${params.id}`, {
    method: "DELETE",
    headers: buildContentBackendHeaders(req),
  });

  return proxyResponse(response);
}
