"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";

import { i18nConfig } from "@/i18nConfig";
import {
  normalizeLocale,
  replaceLocaleInPathname,
  resolveLocaleFromBrowserLanguages,
  supportedLocales,
  type SupportedLocale,
} from "@/shared/i18n/locale";
import { getLangSyncedCookie } from "@/shared/i18n/lang-sync-cookie";
import { getAccessTokenCookie } from "@/shared/auth/access-token-cookie";
import { setAccessTokenCookie } from "@/shared/auth/access-token-cookie";
import { refreshBackendSession } from "@/shared/auth/backend-session";
import { updateUserLanguagePreference } from "@/shared/api/client";

const localeLabels: Record<SupportedLocale, string> = {
  uk: "UA",
  ru: "RU",
  en: "EN",
  de: "DE",
};

type LocaleOption =
  | { type: "locale"; locale: SupportedLocale }
  | { type: "auto" };

export default function LanguageSwitcher() {
  const pathname = usePathname() || `/${i18nConfig.defaultLocale}`;
  const router = useRouter();
  const cookieLocale = getLangSyncedCookie();
  const currentLocale = cookieLocale
    ? cookieLocale
    : normalizeLocale(
        pathname.split("/").filter(Boolean)[0] || null,
        i18nConfig.defaultLocale as SupportedLocale,
      );
  const [isUpdating, setIsUpdating] = useState(false);
  const browserLocale = useMemo(() => {
    if (typeof navigator === "undefined") {
      return i18nConfig.defaultLocale as SupportedLocale;
    }

    return resolveLocaleFromBrowserLanguages(
      navigator.languages.length > 0 ? navigator.languages : [navigator.language],
      i18nConfig.defaultLocale as SupportedLocale,
    );
  }, []);

  const options: LocaleOption[] = [...supportedLocales.map((locale) => ({
    type: "locale" as const,
    locale,
  })), { type: "auto" as const }];

  const commitLocaleChange = async (nextLocale: SupportedLocale | "", nextPathLocale: SupportedLocale) => {
    const hasAuthSession = Boolean(getAccessTokenCookie());

    if (hasAuthSession) {
      try {
        await updateUserLanguagePreference({
          lang: nextLocale,
          locale: nextPathLocale,
        });

        try {
          const refreshed = await refreshBackendSession({ locale: nextPathLocale });
          setAccessTokenCookie(refreshed.accessToken);
        } catch {
          // Silent refresh is best-effort.
        }
      } catch {
        // Keep the UI responsive even if persistence fails.
      }
    }

    const nextPath = replaceLocaleInPathname(pathname, nextPathLocale);
    const nextUrl =
      typeof window !== "undefined"
        ? `${nextPath}${window.location.search}${window.location.hash}`
        : nextPath;

    router.replace(nextUrl, { scroll: false });
    router.refresh();
  };

  const handleLocaleSelect = async (nextLocale: SupportedLocale) => {
    if (isUpdating || nextLocale === currentLocale) {
      return;
    }

    setIsUpdating(true);

    try {
      await commitLocaleChange(nextLocale, nextLocale);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAutoSelect = async () => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      await commitLocaleChange("", browserLocale);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <nav aria-label="Language switcher" className="flex items-center text-[18px] leading-[20px]">
      {options.map((option, index) => {
        if (option.type === "auto") {
          return (
            <Fragment key="auto">
              <button
                type="button"
                onClick={() => void handleAutoSelect()}
                disabled={isUpdating}
                className="ml-3 text-[14px] font-medium uppercase tracking-[0.12em] text-black/40 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Reset language to automatic system sync"
              >
                AUTO
              </button>
            </Fragment>
          );
        }

        const isActive = currentLocale === option.locale;

        return (
          <Fragment key={option.locale}>
            <button
              type="button"
              onClick={() => void handleLocaleSelect(option.locale)}
              disabled={isUpdating}
              aria-current={isActive ? "page" : undefined}
              className={[
                "transition-colors",
                isActive ? "font-semibold text-black" : "font-normal text-black/50",
                isUpdating ? "cursor-not-allowed opacity-50" : "",
              ].join(" ")}
            >
              {localeLabels[option.locale]}
            </button>
            {index !== supportedLocales.length - 1 && (
              <span className="mx-[9px] h-[20px] w-[2px] bg-black/50" aria-hidden="true" />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
