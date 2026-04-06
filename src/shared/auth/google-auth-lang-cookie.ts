export const GOOGLE_AUTH_LANG_COOKIE_NAME = "yoga-club-google-auth-lang";

function buildCookieString(value: string, maxAgeSeconds = 600): string {
  return [
    `${GOOGLE_AUTH_LANG_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ].join("; ");
}

export function setGoogleAuthLangCookie(lang: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = buildCookieString(lang);
}

export function clearGoogleAuthLangCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${GOOGLE_AUTH_LANG_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

