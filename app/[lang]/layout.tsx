import type { ReactNode } from "react";

import { i18nConfig, type LocaleT } from "@/i18nConfig";
import ButtonToTop from "@/shared/ui/ButtonToTop";
import Footer from "@/widgets/footer/Footer";
import Header from "@/widgets/header/Header";

export function generateStaticParams(): Array<{ lang: LocaleT }> {
  return i18nConfig.locales.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: LocaleT };
}) {
  return (
    <div
      id="top"
      lang={params.lang}
      data-lang={params.lang}
      className="relative flex min-h-screen flex-col bg-white text-[#2f1815]"
    >
      <Header lang={params.lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={params.lang} />
      <ButtonToTop />
    </div>
  );
}
