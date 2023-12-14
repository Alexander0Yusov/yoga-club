import initTranslations from "@/app/[lang]/i18n";
import LanguageChanger from "@/components/LanguageChanger/LanguageChanger";
import Logo from "@/components/Logo/Logo";
import { TranslationsProvider } from "@/components/TranslationsProvider";
import Link from "next/link";

const i18nNamespaces = ["homePage"];

const Header = async ({ lang }: { lang: any }) => {
  const { t, resources } = await initTranslations(lang, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <div className="flex justify-between border-[1px] border-orange-950 mb-2">
        <Logo />
        <Link href={`/${lang}`}>Home</Link>
        <Link href={`/${lang}/events`}>To events</Link>
        <Link href={`/${lang}/auth/login`}>Auth</Link>
        <LanguageChanger />
      </div>
    </TranslationsProvider>
  );
};

export default Header;
