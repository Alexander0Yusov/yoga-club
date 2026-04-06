"use client";

import Image from "next/image";
import Link from "next/link";

import heroFallbackImage from "@/public/hero_img.jpg";
import HeroSectionAdminControls from "@/features/content-admin/ui/HeroSectionAdminControls";
import HeroSectionEntitySettingsTrigger from "@/features/content-admin/ui/HeroSectionEntitySettingsTrigger";
import type { HeroIntroRecord, SectionRecord } from "@/shared/api/client";
import Container from "@/shared/ui/Container/Container";

type HeroSectionProps = {
  lang: string;
  heroIntro?: HeroIntroRecord | null;
  section?: SectionRecord | null;
};

export default function HeroSection({
  lang,
  heroIntro,
  section,
}: HeroSectionProps) {
  const title =
    typeof heroIntro?.title === "string"
      ? heroIntro.title
      : "Онлайн заняття йогою";
  const text1 =
    typeof heroIntro?.text1 === "string"
      ? heroIntro.text1
      : "Ваш шлях до гармонії тіла і душі";
  const text2 =
    typeof heroIntro?.text2 === "string"
      ? heroIntro.text2
      : "Приєднуйтеся до нашої команди. Перше заняття онлайн — безкоштовно. Практика для тіла, дихання й поступового відновлення ресурсу без зайвого шуму та паралельних інтерфейсів.";
  const heroImageUrl = heroIntro?.image?.url || "";
  const heroImageAlt =
    typeof heroIntro?.image?.alt === "string" ? heroIntro.image.alt : title;

  return (
    <section
      id="hero"
      className="relative h-[800px] overflow-hidden bg-muted-lilac"
    >
      <div className="absolute inset-0 bg-white/50" aria-hidden="true" />

      <Container className="relative z-10 flex h-full py-[260px]">
        <div className="relative max-w-[620px]">
          <HeroSectionAdminControls lang={lang} heroIntro={heroIntro} />
          <h1 className="pb-[28px] font-philosopher text-[44px] font-bold leading-none text-localbrown md:text-[64px] lg:text-[60px]">
            {title}
          </h1>

          <p className="pb-[28px] text-[22px] leading-[1.25] text-[#2c2c2c] md:text-[24px]">
            {text1}
          </p>

          <p className="pb-[44px] text-[16px] leading-7 text-[#2c2c2c] md:text-[18px]">
            {text2}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${lang}#directions`}
              className="rounded-full border border-localbrown bg-[#f3ece8] px-5 py-3 text-sm font-medium text-localbrown transition hover:bg-white"
            >
              Напрямки
            </Link>
            <Link
              href={`/${lang}#contactus`}
              className="rounded-full border border-localbrown bg-[#f3ece8] px-5 py-3 text-sm font-medium text-localbrown transition hover:bg-white"
            >
              Записатися
            </Link>
          </div>
        </div>
      </Container>

      <HeroSectionEntitySettingsTrigger
        lang={lang}
        section={section}
      />

      <div className="absolute inset-y-0 right-0 hidden w-[800px] overflow-hidden border border-[#caa8ab] lg:block">
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={heroImageAlt}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={heroFallbackImage}
            alt="woman near the sea"
            fill
            priority
            sizes="800px"
            className="object-cover"
          />
        )}
      </div>
    </section>
  );
}
