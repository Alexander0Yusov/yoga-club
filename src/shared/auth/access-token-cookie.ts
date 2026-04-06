export const ACCESS_TOKEN_COOKIE_NAME = "yoga-club-access-token";

function buildCookieString(value: string, maxAgeSeconds?: number): string {
  const parts = [
    `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Lax",
  ];

  if (typeof maxAgeSeconds === "number") {
    parts.push(`Max-Age=${maxAgeSeconds}`);
  }

  return parts.join("; ");
}

export function setAccessTokenCookie(accessToken: string, maxAgeSeconds?: number) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = buildCookieString(accessToken, maxAgeSeconds);
}

export function clearAccessTokenCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getAccessTokenCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ACCESS_TOKEN_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  const encodedValue = cookie.slice(ACCESS_TOKEN_COOKIE_NAME.length + 1);

  try {
    return decodeURIComponent(encodedValue);
  } catch {
    return encodedValue;
  }
}
