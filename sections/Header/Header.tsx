import initTranslations from "@/app/[lang]/i18n";
import LanguageChanger from "@/components/LanguageChanger/LanguageChanger";
import TranslationsProvider from "@/components/TranslationsProvider/TranslationsProvider";

const i18nNamespaces = ["homePage"];

const Header = async ({ lang }: { lang: any }) => {
  const { t, resources } = await initTranslations(lang, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={lang}
      resources={resources}
    >
      <div className="flex justify-center border-[1px] border-orange-950 mb-2">
        <h2> Header </h2>
        <LanguageChanger />
      </div>
    </TranslationsProvider>
  );
};

export default Header;
