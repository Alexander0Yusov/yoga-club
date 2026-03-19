"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LocaleT } from "@/i18nConfig";
import { i18nConfig } from "@/i18nConfig";

const locales = i18nConfig.locales as readonly LocaleT[];

function replaceLocale(pathname: string, nextLocale: LocaleT): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  segments[0] = nextLocale;
  return `/${segments.join("/")}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || `/${i18nConfig.defaultLocale}`;

  return (
    <nav aria-label="Language switcher" className="flex items-center gap-2 text-sm">
      {locales.map((locale) => {
        const href = replaceLocale(pathname, locale);

        return (
          <Link
            key={locale}
            href={href}
            className="rounded-full border border-[#81453e] px-3 py-1 text-[#81453e] transition-colors hover:bg-[#dfbeaf]"
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
