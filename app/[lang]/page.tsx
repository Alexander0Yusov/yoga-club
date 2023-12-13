// import { getDictionary } from "./dictionaries";
import { LocaleT } from "@/i18nConfig";
import initTranslations from "./i18n";

export default async function Home({
  params: { lang },
}: {
  params: { lang: LocaleT };
}) {
  // const dict = await getDictionary(locale); // en

  const { t } = await initTranslations(lang, ["homePage", "eventsPage"]);

  return (
    <div className="border-[1px] border-orange-950 w-full flex justify-center mb-2">
      <h1 className="ml-auto mr-auto">Home | {t("home")} </h1>
    </div>
  );
}
