import { LANG_SYNCED_COOKIE_NAME, normalizeLocale, type SupportedLocale } from "./locale";

export function getLangSyncedCookie(): SupportedLocale | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LANG_SYNCED_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  const encodedValue = cookie.slice(LANG_SYNCED_COOKIE_NAME.length + 1);

  try {
    const decodedValue = decodeURIComponent(encodedValue);
    return normalizeLocale(decodedValue);
  } catch {
    return normalizeLocale(encodedValue);
  }
}

