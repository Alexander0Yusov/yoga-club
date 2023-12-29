// import { getDictionary } from "./dictionaries";
import { LocaleT } from "@/i18nConfig";
import initTranslations from "./i18n";
import Container from "@/components/0_ui/Container/Container";
import Section from "@/components/0_ui/Section/Section";
import ContactUsForm from "@/components/ContactUsForm/ContactUsForm";

export default async function Home({
  params: { lang },
}: {
  params: { lang: LocaleT };
}) {
  // const dict = await getDictionary(locale); // en

  const { t } = await initTranslations(lang, ["homePage", "eventsPage"]);

  return (
    <Container className="flex flex-col justify-center py-[20px]">
      <h1 className="ml-auto mr-auto">Home Page</h1>
      <h2 className="ml-auto mr-auto">{t("home")}</h2>
      <Section id="contactUs" className="flex flex-col">
        <h2 className="mx-auto font-philosopher font-bold text-6xl">
          Заявка на заняття
        </h2>

        <ContactUsForm />
      </Section>
    </Container>
  );
}
