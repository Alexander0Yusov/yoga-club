import initTranslations from "@/app/[lang]/i18n";
import Container from "@/components/0_ui/Container/Container";
import HeaderNavbar from "@/components/HeaderNavbar/HeaderNavbar";
import LanguageChanger from "@/components/LanguageChanger/LanguageChanger";
import Logo from "@/components/Logo/Logo";
import { TranslationsProvider } from "@/components/TranslationsProvider";

const i18nNamespaces = ["homePage"];

const Header = async ({ lang }: { lang: any }) => {
  const { t, resources } = await initTranslations(lang, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <header>
        <Container className="flex justify-between items-center border-[1px] border-orange-950 h-[60px]">
          <Logo />

          <HeaderNavbar lang={lang} />

          <LanguageChanger />
        </Container>
      </header>
    </TranslationsProvider>
  );
};

export default Header;
