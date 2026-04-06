import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";

import "./globals.css";
import {
  LANG_SYNCED_COOKIE_NAME,
  normalizeLocale,
  resolveLocaleFromAcceptLanguage,
} from "@/shared/i18n/locale";
import Providers from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookieLocale = cookies().get(LANG_SYNCED_COOKIE_NAME)?.value;
  const acceptLanguage = headers().get("accept-language");
  const lang = cookieLocale
    ? normalizeLocale(cookieLocale, "uk")
    : resolveLocaleFromAcceptLanguage(acceptLanguage, "uk");

  return (
    <html lang={lang}>
      <body>
        <Providers>{children}</Providers>
        <div id="modal" />
      </body>
    </html>
  );
}
