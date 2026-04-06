import { cookies, headers } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE_NAME,
} from "@/shared/auth/access-token-cookie";
import {
  fetchBackendMe,
  mapBackendMeToFrontendSessionUser,
} from "@/shared/auth/backend-session";

function normalizeLang(value?: string | null) {
  const normalized = (value || "").trim().toLowerCase();

  return normalized ? normalized.slice(0, 2) : "";
}

export async function GET() {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return Response.json(null);
  }

  const requestedLang = normalizeLang(headers().get("accept-language"));

  try {
    const backendUser = await fetchBackendMe({
      accessToken,
      locale: requestedLang || "en",
    });

    return Response.json(
      mapBackendMeToFrontendSessionUser(backendUser, requestedLang),
    );
  } catch {
    return Response.json(null);
  }
}
