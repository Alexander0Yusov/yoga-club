import { type NextRequest } from "next/server";
import {
  LANG_SYNCED_COOKIE_NAME,
  normalizeLocale,
  resolveLocaleFromAcceptLanguage,
} from "@/shared/i18n/locale";

const remoteContentBaseURL = "https://yoga-club-back.vercel.app/api";

export const CONTENT_BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_CONTENT_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5005/api"
    : remoteContentBaseURL);
export const ACCESS_TOKEN_COOKIE_NAME = "yoga-club-access-token";

export function buildContentBackendHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const queryLanguage = req.nextUrl.searchParams.get("lang") || undefined;
  const cookieLanguage = req.cookies.get(LANG_SYNCED_COOKIE_NAME)?.value || undefined;
  const acceptLanguage = queryLanguage
    ? normalizeLocale(queryLanguage)
    : cookieLanguage
      ? normalizeLocale(cookieLanguage)
      : resolveLocaleFromAcceptLanguage(req.headers.get("accept-language"));
  const clientLanguage = normalizeLocale(
    req.headers.get("x-client-lang") || cookieLanguage || queryLanguage || acceptLanguage,
  );

  headers.set("Accept-Language", acceptLanguage);
  headers.set("x-client-lang", clientLanguage);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

export async function proxyResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "application/json";

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  });
}
