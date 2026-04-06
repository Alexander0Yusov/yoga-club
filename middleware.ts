import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "@/i18nConfig";
import { NextRequest, NextResponse } from "next/server";
import { supportedLocales, type SupportedLocale } from "@/shared/i18n/locale";

function parseSyncedLocaleCookie(value: string | undefined): SupportedLocale | null {
  if (!value) {
    return null;
  }

  let nextValue = value.trim();

  if (nextValue.startsWith("s:")) {
    nextValue = nextValue.slice(2);
  }

  try {
    nextValue = decodeURIComponent(nextValue);
  } catch {
    // Ignore malformed encoding and continue with the raw value.
  }

  const candidate = nextValue.split(".")[0]?.trim().toLowerCase();

  if (!candidate) {
    return null;
  }

  const normalizedCandidate = candidate === "ua" ? "uk" : candidate;

  if ((supportedLocales as readonly string[]).includes(normalizedCandidate)) {
    return normalizedCandidate as SupportedLocale;
  }

  return null;
}

function getCurrentPathLocale(pathname: string): SupportedLocale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0]?.trim().toLowerCase();

  if (!firstSegment) {
    return null;
  }

  const normalizedSegment = firstSegment === "ua" ? "uk" : firstSegment;

  if ((supportedLocales as readonly string[]).includes(normalizedSegment)) {
    return normalizedSegment as SupportedLocale;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const syncedLocale = parseSyncedLocaleCookie(request.cookies.get("lang_synced")?.value);

  if (syncedLocale) {
    const currentLocale = getCurrentPathLocale(request.nextUrl.pathname);
    const pathnameWithoutLocale = request.nextUrl.pathname
      .split("/")
      .filter(Boolean)
      .slice(currentLocale ? 1 : 0)
      .join("/");
    const nextPathname = `/${syncedLocale}${pathnameWithoutLocale ? `/${pathnameWithoutLocale}` : ""}`;

    if (nextPathname !== request.nextUrl.pathname) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = nextPathname;

      return NextResponse.redirect(redirectUrl, 307);
    }

    return NextResponse.next();
  }

  return i18nRouter(request, i18nConfig);
}

// only applies this middleware to files in the app directory
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
