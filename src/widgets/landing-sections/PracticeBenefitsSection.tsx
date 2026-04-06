import Image from "next/image";

import { resolveLocalizedText } from "@/features/content-admin/model/resolveLocalizedText";
import PracticeBenefitAdminControls from "@/features/content-admin/ui/PracticeBenefitAdminControls";
import PracticeBenefitsSectionSettingsTrigger from "@/features/content-admin/ui/PracticeBenefitsSectionSettingsTrigger";
import type { PracticeBenefitRecord, SectionRecord } from "@/shared/api/client";
import benefitsImage from "@/public/benefits_img.jpg";
import { practiceBenefitMock } from "@/shared/mock/practice-benefit.mock";
import Container from "@/shared/ui/Container/Container";

type PracticeBenefitsSectionProps = {
  lang: string;
  section?: SectionRecord | null;
  practiceBenefit?: PracticeBenefitRecord | null;
};

const benefitSlots = [
  {
    key: "text_1",
    style: { left: "50%", top: "20px", transform: "translateX(-50%)" },
  },
  { key: "text_2", style: { right: "calc(50% + 210px)", top: "108px" } },
  { key: "text_3", style: { left: "calc(50% + 210px)", top: "108px" } },
  { key: "text_4", style: { right: "calc(50% + 305px)", top: "238px" } },
  { key: "text_5", style: { left: "calc(50% + 305px)", top: "238px" } },
  { key: "text_6", style: { right: "calc(50% + 305px)", bottom: "238px" } },
  { key: "text_7", style: { left: "calc(50% + 305px)", bottom: "238px" } },
  { key: "text_8", style: { right: "calc(50% + 210px)", bottom: "108px" } },
  { key: "text_9", style: { left: "calc(50% + 210px)", bottom: "108px" } },
  {
    key: "text_10",
    style: { left: "50%", bottom: "20px", transform: "translateX(-50%)" },
  },
] as const;

function BenefitLabel({ text }: { text: string }) {
  return (
    <p className="whitespace-nowrap font-mulish text-[24px] font-normal leading-none text-black">
      {text}
    </p>
  );
}

export default function PracticeBenefitsSection({
  lang,
  section,
  practiceBenefit,
}: PracticeBenefitsSectionProps) {
  const fallbackTexts = practiceBenefitMock.map((item) => item.text_1);
  const benefitTexts = [
    resolveLocalizedText(practiceBenefit?.text_1, lang, fallbackTexts[0]),
    resolveLocalizedText(practiceBenefit?.text_2, lang, fallbackTexts[1]),
    resolveLocalizedText(practiceBenefit?.text_3, lang, fallbackTexts[2]),
    resolveLocalizedText(practiceBenefit?.text_4, lang, fallbackTexts[3]),
    resolveLocalizedText(practiceBenefit?.text_5, lang, fallbackTexts[4]),
    resolveLocalizedText(practiceBenefit?.text_6, lang, fallbackTexts[5]),
    resolveLocalizedText(practiceBenefit?.text_7, lang, fallbackTexts[6]),
    resolveLocalizedText(practiceBenefit?.text_8, lang, fallbackTexts[7]),
    resolveLocalizedText(practiceBenefit?.text_9, lang, fallbackTexts[8]),
    resolveLocalizedText(practiceBenefit?.text_10, lang, fallbackTexts[9]),
  ];
  const benefitImageUrl = practiceBenefit?.image?.url || "";
  const sectionTitle = resolveLocalizedText(
    section?.title,
    lang,
    "Покращення відчуття балансу й рівноваги",
  );

  return (
    <section id="benefits" className="relative py-10 md:py-14">
      <Container className="relative space-y-8">
        <div className="relative pb-4 pt-1">
          <PracticeBenefitAdminControls
            lang={lang}
            practiceBenefit={practiceBenefit}
          />
          <h2 className="text-left font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid gap-6 lg:hidden">
          <div className="relative mx-auto aspect-square w-full max-w-[500px] overflow-hidden rounded-full bg-[#f7f0ec] shadow-sm">
            {benefitImageUrl ? (
              <img
                src={benefitImageUrl}
                alt="Yoga benefits"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={benefitsImage}
                alt="Yoga benefits"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            )}
          </div>

          <div className="grid gap-4">
            {benefitTexts.map((text, index) => (
              <BenefitLabel key={`${index}-${text.slice(0, 12)}`} text={text} />
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block lg:h-[710px]">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#f7f0ec] shadow-sm">
            {benefitImageUrl ? (
              <img
                src={benefitImageUrl}
                alt="Yoga benefits"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={benefitsImage}
                alt="Yoga benefits"
                fill
                sizes="500px"
                className="object-cover"
              />
            )}
          </div>

          {benefitSlots.map((slot, index) => (
            <div key={slot.key} className="absolute" style={slot.style}>
              <BenefitLabel text={benefitTexts[index] || ""} />
            </div>
          ))}
        </div>
      </Container>

      <PracticeBenefitsSectionSettingsTrigger lang={lang} section={section} />
    </section>
  );
}
