// import { getDictionary } from "./dictionaries";
import { LocaleT } from "@/i18nConfig";
import initTranslations from "./i18n";
import Container from "@/components/0_ui/Container/Container";
import Section from "@/components/0_ui/Section/Section";
import ContactUsForm from "@/components/ContactUsForm/ContactUsForm";
import SectionFeedbacks from "@/sections/SectionFeedbacks/SectionFeedbacks";
import Link from "next/link";
import Image from "next/image";

import heroImg from "@/public/hero_img.jpg";
import benefitsImg from "@/public/benefits_img.jpg";
import LinkAncor from "@/components/0_ui/LinkAncor/LinkAncor";
import AboutSlider from "@/components/AboutSlider/AboutSlider";
import AdvantagesSlider from "@/components/AdvantagesSlider/AdvantagesSlider";
import DirectionsSlider from "@/components/DirectionsSlider/DirectionsSlider";
import EventLink from "@/components/EventLink/EventLink";
import DemoVideosSlider from "@/components/DemoVideosSlider/DemoVideosSlider";

export default async function Home({
  params: { lang },
}: {
  params: { lang: LocaleT };
}) {
  // const dict = await getDictionary(locale); // en

  const { t } = await initTranslations(lang, ["homePage", "eventsPage"]);

  return (
    <>
      <Section id="hero2" className=" relative h-[800px] bg-lilac">
        <Container className="flex h-full py-[260px]">
          <div>
            <h1 className=" pb-[28px] font-philosopher font-bold text-fs60 text-localbrown">
              Онлайн заняття йогою
            </h1>

            <p className=" pb-[28px] text-fs24 ">
              Ваш шлях до досконалості злиття душі і тіла
            </p>

            <p className=" text-fs18 pb-[44px]">
              Приєднуйтесь до нашої команди. Перше заняття онлайн безкоштовно
            </p>

            <LinkAncor href={"#contactus"}>Записатись</LinkAncor>
          </div>
        </Container>

        <div className=" absolute inset-y-0 right-0 w-[800px] rounded-l-full overflow-hidden border-[1px] border-orange-400">
          <Image
            src={heroImg}
            alt="woman near the sea"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </Section>

      <Container className="flex flex-col justify-center">
        <Section id="benefits" className="h-[804px] pt-[70px]">
          <h2 className=" pb-[36px] font-philosopher font-bold text-fs60 text-localbrown">
            Користь заняття йогою
          </h2>

          <div className=" relative flex flex-col items-center text-fs24 border-[1px] border-orange-950 ">
            <p className=" mb-[36px] ">
              Покращення відчуття балансу й рівноваги
            </p>

            <div
              id="thumbBenefits"
              className=" relative w-[500px] h-[500px] rounded-full overflow-hidden"
            >
              <Image src={benefitsImg} alt="woman on the floor" />
            </div>

            <p className=" mt-[36px] ">Покращення якості життя</p>

            <p className=" absolute left-[350px] top-[85px] ">Зняття стресу</p>
            <p className=" absolute left-[100px] top-[224px] ">
              Позитивний вплив на мозок
            </p>
            <p className=" absolute left-[164px] top-[380px] ">
              Покращення гнучкості
            </p>
            <p className=" absolute left-[260px] top-[512px] ">
              Покращення постави
            </p>

            <p className=" absolute left-[890px] top-[85px] ">
              Збільшення сили
            </p>
            <p className=" absolute left-[970px] top-[224px] ">
              Допомога під час вигоряння
            </p>
            <p className=" absolute left-[970px] top-[380px] ">
              Підвищення імунітету
            </p>
            <p className=" absolute left-[890px] top-[512px] ">
              Покращення сну
            </p>
          </div>
        </Section>

        <Section id="about" className="h-[734px] pt-[70px]">
          <h2 className=" pb-[36px] font-philosopher font-bold text-fs60 text-localbrown">
            Про інструктора
          </h2>

          <AboutSlider />
        </Section>

        <Section id="advantages" className=" h-[760px] pt-[70px]">
          <h2 className=" pb-[50px] font-philosopher font-bold text-fs60 text-localbrown">
            Наші переваги
          </h2>

          <AdvantagesSlider />
        </Section>

        <Section id="directions" className=" h-[748px] pt-[70px]">
          <h2 className=" pb-[50px] font-philosopher font-bold text-fs60 text-localbrown">
            Напрямки йоги
          </h2>

          <DirectionsSlider />
        </Section>

        <Section id="events" className=" h-[650px] pt-[70px]">
          <h2 className=" mb-[30px] font-philosopher font-bold text-fs60 text-localbrown">
            Наші події
          </h2>

          <div className="flex justify-between">
            <EventLink lang={lang} targetPage={"events"} />
            <EventLink lang={lang} targetPage={"events/archive"} />
          </div>
        </Section>

        <Section id="demovideos" className=" h-[592px] pt-[70px]">
          <h2 className=" mb-[30px] font-philosopher font-bold text-fs60 text-localbrown">
            Демо-відео занять
          </h2>

          <DemoVideosSlider />
        </Section>

        <Section id="contactus" className=" pt-[70px]">
          <h2 className="mb-[30px] font-philosopher font-bold text-fs60 text-localbrown">
            Заявка на заняття
          </h2>

          <ContactUsForm />
        </Section>

        <SectionFeedbacks />

        {/* <h1 className="ml-auto mr-auto">Home Page</h1>
        <h2 className="ml-auto mr-auto">{t("home")}</h2> */}
      </Container>
    </>
  );
}
