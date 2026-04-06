import type { LocalizedTextPayload } from "@/shared/api/client";

const FALLBACK_LOCALES = ["ru", "en", "uk", "de"] as const;

type SupportedLocale = (typeof FALLBACK_LOCALES)[number];

function normalizeLocale(locale?: string) {
  const value = (locale || "").trim().toLowerCase();

  if (value === "ru" || value === "en" || value === "uk" || value === "de") {
    return value as SupportedLocale;
  }

  return "ru" as SupportedLocale;
}

export function resolveLocalizedText(
  value?: LocalizedTextPayload | string | null,
  locale?: string,
  fallback = ""
): string {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  const currentLocale = normalizeLocale(locale);
  const currentValue = value[currentLocale];

  if (currentValue) {
    return currentValue;
  }

  for (const nextLocale of FALLBACK_LOCALES) {
    if (value[nextLocale]) {
      return value[nextLocale] as string;
    }
  }

  return fallback;
}

export function createLocalizedTextPayload(
  value: string,
  locale?: string
): LocalizedTextPayload {
  const currentLocale = normalizeLocale(locale);

  return currentLocale === "ru"
    ? { ru: value }
    : {
        ru: value,
      [currentLocale]: value,
    };
}

export function ensureLocalizedTextPayload(
  value: LocalizedTextPayload | string | undefined,
  locale?: string
): LocalizedTextPayload {
  if (!value) {
    return createLocalizedTextPayload("", locale);
  }

  if (typeof value === "string") {
    return createLocalizedTextPayload(value, locale);
  }

  return value;
}

export function mergeLocalizedTextPayload(
  existing: LocalizedTextPayload | string | undefined,
  value: string,
  locale?: string
): LocalizedTextPayload {
  const currentValue = createLocalizedTextPayload(value, locale);

  if (!existing) {
    return currentValue;
  }

  if (typeof existing === "string") {
    return currentValue;
  }

  return {
    ...existing,
    ...currentValue,
  };
}
