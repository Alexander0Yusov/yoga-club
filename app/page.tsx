import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import { i18nConfig } from "@/i18nConfig";
import {
  LANG_SYNCED_COOKIE_NAME,
  normalizeLocale,
  resolveLocaleFromAcceptLanguage,
} from "@/shared/i18n/locale";

export default function HomePage() {
  const cookieLocale = cookies().get(LANG_SYNCED_COOKIE_NAME)?.value;
  const acceptLanguage = headers().get("accept-language");
  const lang = cookieLocale
    ? normalizeLocale(cookieLocale, i18nConfig.defaultLocale as "uk")
    : resolveLocaleFromAcceptLanguage(
        acceptLanguage,
        i18nConfig.defaultLocale as "uk",
      );

  redirect(`/${lang}`);
}
