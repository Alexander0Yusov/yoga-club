import { i18nConfig } from "@/i18nConfig";

export const supportedLocales = ["uk", "ru", "en", "de"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const LANG_SYNCED_COOKIE_NAME = "lang_synced";

export function normalizeLocale(
  locale?: string | null,
  fallback: SupportedLocale = i18nConfig.defaultLocale as SupportedLocale,
): SupportedLocale {
  const value = (locale || "").trim().toLowerCase();

  if (!value) {
    return fallback;
  }

  const primary = value.split(",")[0]?.split(";")[0]?.split("-")[0]?.split("_")[0]?.trim();

  if (primary === "ua") {
    return "uk";
  }

  if ((supportedLocales as readonly string[]).includes(primary)) {
    return primary as SupportedLocale;
  }

  return fallback;
}

export function resolveLocaleFromAcceptLanguage(
  acceptLanguage?: string | null,
  fallback: SupportedLocale = i18nConfig.defaultLocale as SupportedLocale,
): SupportedLocale {
  if (!acceptLanguage) {
    return fallback;
  }

  const [preferred] = acceptLanguage.split(",");

  return normalizeLocale(preferred, fallback);
}

export function resolveLocaleFromBrowserLanguage(
  browserLanguage?: string | null,
  fallback: SupportedLocale = i18nConfig.defaultLocale as SupportedLocale,
): SupportedLocale {
  return normalizeLocale(browserLanguage, fallback);
}

export function resolveLocaleFromBrowserLanguages(
  browserLanguages?: readonly string[] | null,
  fallback: SupportedLocale = i18nConfig.defaultLocale as SupportedLocale,
): SupportedLocale {
  if (!browserLanguages || browserLanguages.length === 0) {
    return fallback;
  }

  for (const language of browserLanguages) {
    const resolved = normalizeLocale(language, fallback);
    const normalizedInput = (language || "").trim().toLowerCase().split(",")[0]?.split(";")[0]?.split("-")[0]?.split("_")[0]?.trim();

    if (normalizedInput && (supportedLocales as readonly string[]).includes(normalizedInput)) {
      return resolved;
    }
  }

  return fallback;
}

export function replaceLocaleInPathname(
  pathname: string,
  nextLocale: SupportedLocale,
): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  segments[0] = nextLocale;
  return `/${segments.join("/")}`;
}
