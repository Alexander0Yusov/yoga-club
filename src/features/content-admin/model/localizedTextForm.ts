import type { LocalizedTextPayload } from "@/shared/api/client";
import { z } from "zod";

export const contentAdminLocales = ["ru", "en", "de", "uk"] as const;

export type ContentAdminLocale = (typeof contentAdminLocales)[number];

export type LocalizedTextDraft = Record<ContentAdminLocale, string>;

function createMirroredDraft(value: string): LocalizedTextDraft {
  return {
    ru: value,
    en: value,
    de: value,
    uk: value,
  };
}

function unwrapLocalizedValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;

  if (typeof record._doc === "string") {
    return record._doc;
  }

  if (record._doc && typeof record._doc === "object") {
    return unwrapLocalizedValue(record._doc);
  }

  return value;
}

function readWrappedText(value: unknown): string | undefined {
  const unwrappedValue = unwrapLocalizedValue(value);

  if (typeof unwrappedValue === "string") {
    return unwrappedValue;
  }

  return undefined;
}

export function createEmptyLocalizedDraft(
  value = ""
): LocalizedTextDraft {
  return {
    ru: value,
    en: "",
    de: "",
    uk: "",
  };
}

export function normalizeLocalizedDraft(
  value?: LocalizedTextPayload | string | null,
  locale?: string
): LocalizedTextDraft {
  const nextDraft = createEmptyLocalizedDraft("");

  const unwrappedValue = unwrapLocalizedValue(value);

  if (typeof unwrappedValue === "string") {
    return createMirroredDraft(unwrappedValue);
  }

  if (!unwrappedValue) {
    return nextDraft;
  }

  const normalizedValue = unwrappedValue as LocalizedTextPayload;
  for (const nextLocale of contentAdminLocales) {
    const nextValue =
      readWrappedText(normalizedValue[nextLocale]) ||
      (normalizedValue[nextLocale] as string) ||
      "";
    nextDraft[nextLocale] = nextValue;
  }

  if (!nextDraft.en && nextDraft.ru) {
    nextDraft.en = nextDraft.ru;
  }

  if (!nextDraft.de && nextDraft.ru) {
    nextDraft.de = nextDraft.ru;
  }

  if (!nextDraft.uk && nextDraft.ru) {
    nextDraft.uk = nextDraft.ru;
  }

  return nextDraft;
}

export function toLocalizedPayload(
  value: LocalizedTextDraft
): LocalizedTextPayload {
  return {
    ru: value.ru.trim(),
    en: value.en.trim(),
    de: value.de.trim(),
    uk: value.uk.trim(),
  };
}

export function hasLocalizedValue(value: LocalizedTextDraft): boolean {
  return contentAdminLocales.some((locale) => value[locale].trim().length > 0);
}

export function unwrapLocalizedText(
  value?: LocalizedTextPayload | string | null
): string | LocalizedTextPayload | undefined {
  const unwrappedValue = unwrapLocalizedValue(value);

  if (typeof unwrappedValue === "string") {
    return unwrappedValue;
  }

  return unwrappedValue as LocalizedTextPayload | undefined;
}

export function createLocalizedTextSchema(
  requiredRu: boolean,
  requiredMessage: string
) {
  const optionalLocalizedString = z
    .string()
    .trim()
    .refine((value) => value.length === 0 || value.length >= 2, {
      message: "Минимум 2 символа",
    });
  const requiredLocalizedString = z.string().trim().min(2, requiredMessage);

  const schema = z.object({
    ru: requiredRu ? requiredLocalizedString : optionalLocalizedString,
    en: optionalLocalizedString,
    de: optionalLocalizedString,
    uk: optionalLocalizedString,
  });

  if (!requiredRu) {
    return schema;
  }

  return schema.refine(
    (value) =>
      contentAdminLocales.some((locale) => value[locale].trim().length >= 2),
    {
      message: requiredMessage,
      path: ["ru"],
    }
  );
}
