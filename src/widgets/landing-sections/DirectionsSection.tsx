"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import { EffectFade, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Container from "@/shared/ui/Container/Container";

import directions1 from "@/public/directions_1.jpg";
import directions2 from "@/public/directions_2.jpg";
import directions3 from "@/public/directions_3.jpg";
import directions4 from "@/public/directions_4.jpg";
import directions5 from "@/public/directions_5.jpg";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/keyboard";

type DirectionSlide = {
  title: string;
  image: StaticImageData;
  alt: string;
  paragraphs: string[];
};

const slides: DirectionSlide[] = [
  {
    title: "Комплексне заняття",
    image: directions1,
    alt: "Complex class",
    paragraphs: [
      "Комплексне заняття містить в собі асани на розтяжку, різні типи дихання, які поліпшують роботу серця і легенів та підвищують загальну витривалість організму, а також силові асани, які роблять м’язи міцнішими. Наприкінці заняття виконуються вправи на розслаблення і медитація в глибокій йога-нідрі.",
    ],
  },
  {
    title: "Йогатерапія",
    image: directions2,
    alt: "Yoga therapy",
    paragraphs: [
      "Йогатерапія по більшості орієнтована на індивідуальні заняття, тому що головне завдання - вирішити певні проблеми з фізичним або нервово-психологічним станом людини, яка вирішує почати займатися в нас.",
      "Йогатерапевтичний комплекс з елементами фізіотерапії та лікувальної гімнастики зосереджується на використанні методів та технік йоги як інструментів для відновлення організму на всіх рівнях.",
      "Вибір технік підбирається на розумінні анамнезу захворювань від нервових проблем до порушень опорно-рухового апарату.",
    ],
  },
  {
    title: "Медитація та пранаями",
    image: directions3,
    alt: "Meditation and pranayama",
    paragraphs: [
      "Медитації цілеспрямовано впливають як на фізичний, так і на душевний стан людини, додають та гармонізують життєву енергію організму. Практикуючи медитацію, ви навчитеся керувати своїми емоціями, будете краще справлятися зі стресом і депресією, знаєте тривогу та зробите більш доброзичливими до оточуючих.",
      "Пранаяма — це дихальна практика в йозі, сукупність дихальних вправ, виконуючи які практикуючий вчиться свідомо управляти власним диханням.",
    ],
  },
  {
    title: "Майстер-клас зі шпагатів",
    image: directions4,
    alt: "Split masterclass",
    paragraphs: [
      "Гнучкість нашого мислення досить часто залежить від гнучкості тіла. Шпагати для цієї цілі підходять якнайкраще.",
      "Як і в інших складних асанах, у шпагатів яскраво виражений психологічний ефект. Шпагати активно задіюють передню та задню частини стегон, м’язи тазового дна, які активно починають діяти та укріплюватись.",
      "Ми надаємо ефективні техніки досягнення поздовжніх та поперекових шпагатів протягом відносно невеликого часу.",
    ],
  },
  {
    title: "Йогатури",
    image: directions5,
    alt: "Yoga tour",
    paragraphs: [
      "Йога-тур, як варіант для активного відпочинку зі змістом. Користь хорошого йога-туру величезна: спортивний і водночас розслаблюючий, насичений подіями та тренуваннями, він допомагає прибрати втому та зняти стрес, зарядитися енергією, налаштуватися на позитив, освоїти нові практики.",
      "Це міні-подорож, реальна та ментальна, яка стане ключем до фізичної та духовної рівноваги.",
    ],
  },
];

export default function DirectionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<{
    slideTo: (index: number) => void;
  } | null>(null);

  return (
    <section id="directions" className="py-10 md:py-14">
      <Container className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-[#497274]">
            Напрямки йоги
          </p>
          <h2 className="font-philosopher text-[38px] font-bold leading-none text-localbrown md:text-[54px]">
            Практики для різних цілей
          </h2>
        </div>

        <div className="flex flex-wrap justify-between gap-3 text-[16px] leading-none text-[#497274] md:gap-4 md:text-[24px]">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`transition ${
                index === activeIndex ? "font-bold underline" : ""
              }`}
              onClick={() => {
                swiper?.slideTo(index);
                setActiveIndex(index);
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        <Swiper
          modules={[EffectFade, Keyboard]}
          effect="fade"
          keyboard={{ enabled: true, onlyInViewport: false }}
          speed={650}
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          className="border border-[#dfbeaf] bg-white"
        >
          {slides.map((item) => (
            <SwiperSlide key={item.title} className="min-h-[480px]">
              <div className="flex flex-col gap-6 bg-white px-0 py-0 lg:h-[480px] lg:flex-row lg:items-stretch lg:justify-between">
                <div className="relative h-[260px] overflow-hidden bg-[#f7f0ec] lg:h-full lg:w-[683px]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 683px"
                    className="object-cover"
                  />
                </div>

                <div className="w-full px-4 pb-6 text-[16px] leading-[1.3] text-[#2c2c2c] md:px-6 lg:w-[627px] lg:px-0 lg:py-0 lg:pt-0 lg:text-[18px]">
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mb-[10px]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
