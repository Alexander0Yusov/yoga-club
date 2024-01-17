import initTranslations from "@/app/[lang]/i18n";
import Container from "@/components/0_ui/Container/Container";
import HeaderProfileLink from "@/components/HeaderProfileLink/HeaderProfileLink";
import HomeAncorsHeader from "@/components/HomeAncorsHeader/HomeAncorsHeader";
import LanguageChanger2 from "@/components/LanguageChanger2/LanguageChanger2";
import Logo from "@/components/Logo/Logo";
import { TranslationsProvider } from "@/components/TranslationsProvider";
import { LocaleT } from "@/i18nConfig";
import Link from "next/link";
import React from "react";

const i18nNamespaces = ["homePage"];

const Header2 = async ({ lang }: { lang: LocaleT }) => {
  const { t, resources } = await initTranslations(lang, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <header className="w-full h-[100px] font-mulish bg-lilac/50 border-[1px] border-orange-950">
        <Container className="flex items-center h-full border-[1px] border-orange-950">
          <Logo className="" />

          <HomeAncorsHeader />

          <HeaderProfileLink />

          <LanguageChanger2 />
        </Container>
      </header>
    </TranslationsProvider>
  );
};

export default Header2;
