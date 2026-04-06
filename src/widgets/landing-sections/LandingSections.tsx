import HeroSection from "./HeroSection";
import PracticeBenefitsSection from "./PracticeBenefitsSection";
import AdvantageSection from "./AdvantageSection";
import DirectionsSection from "./DirectionsSection";
import AboutSection from "./AboutSection";
import PublicEventsSection from "./PublicEventsSection";
import ContactSection from "./ContactSection";

import DemoVideosSlider from "@/features/demo-video/ui/DemoVideosSlider";
import FeedbackSection from "@/features/feedback/ui/FeedbackSection";
import {
  getHeroIntros,
  getPracticeBenefits,
  getSections,
} from "@/shared/api/client";
import Container from "@/shared/ui/Container/Container";

export default async function LandingSections({ lang }: { lang: string }) {
  let heroIntro = null;
  let heroSection = null;
  let practiceBenefitsSection = null;
  let practiceBenefit = null;

  try {
    const [heroIntros, practiceBenefits, sections] = await Promise.all([
      getHeroIntros({ locale: lang }),
      getPracticeBenefits({ locale: lang }),
      getSections({ locale: lang }),
    ]);

    heroIntro = heroIntros[0] ?? null;
    practiceBenefit = practiceBenefits[0] ?? null;
    heroSection =
      sections.find((item) => item.for === "hero_intro") ?? null;
    practiceBenefitsSection =
      sections.find((item) => item.for === "practice_benefits") ?? null;
  } catch {
    heroIntro = null;
    heroSection = null;
    practiceBenefitsSection = null;
    practiceBenefit = null;
  }

  return (
    <div className="flex flex-col">
      <HeroSection
        lang={lang}
        heroIntro={heroIntro}
        section={heroSection}
      />
      <PracticeBenefitsSection
        lang={lang}
        section={practiceBenefitsSection}
        practiceBenefit={practiceBenefit}
      />
      <AboutSection />
      <AdvantageSection />
      <DirectionsSection />
      <PublicEventsSection
        lang={lang}
        title="Події, зустрічі та живі практики"
      />

      <section id="demovideos" className="py-10 md:py-14">
        <Container className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-[#497274]">
              Відео галерея
            </p>
            <h2 className="font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
              Демо відео та живі фрагменти практик
            </h2>
          </div>

          <DemoVideosSlider />
        </Container>
      </section>

      <ContactSection
        lang={lang}
        category="ЗАПИС НА ЗАНЯТТЯ"
        subtitle="Залиште заявку, і ми зв’яжемося з вами"
        title="Залиште заявку на заняття"
      />

      <FeedbackSection id="feedback" />
    </div>
  );
}
